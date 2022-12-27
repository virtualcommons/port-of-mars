import { Room, Client, matchMaker } from 'colyseus';
import schedule from 'node-schedule';
import { ROLES } from '@port-of-mars/shared/types';
import { isDev } from '@port-of-mars/shared/settings';
import { buildGameOpts } from '@port-of-mars/server/util';
import { GameRoom } from '@port-of-mars/server/rooms/game';
import { LobbyRoomState } from '@port-of-mars/server/rooms/lobby/state';
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import _ from "lodash";
import * as http from "http";
import { DistributeGroups, WaitingResponses, LOBBY_NAME, AcceptInvitation } from "@port-of-mars/shared/lobby";

const logger = settings.logging.getLogger(__filename);

class MatchmakingGroup {
  clientStats: Array<ClientStat> = [];
  ready = false;
  confirmed = 0;

  isFull(maxClients: number): boolean {
    return this.clientStats.length >= maxClients;
  }

  hasConfirmedAllClients() {
    return this.confirmed === this.clientStats.length;
  }
}

interface ClientStat {
  client: Client;
  priority?: boolean;
  waitingTime: number;
  options?: any;
  group?: MatchmakingGroup;
  rank: number;
  confirmed?: boolean;
  hasInvite?: boolean;
}

export class RankedLobbyRoom extends Room<LobbyRoomState> {

  public static get NAME(): string { return LOBBY_NAME }

  /**
   * Distribute clients into groups at this interval (minutes)
   */
  groupAssignmentInterval = 1;

  /**
   * Force assignment of connected players into a group after this much time has passed (in minutes)
   */
  forceGroupAssignmentInterval = -1;
  
  /**
   * Number of minutes elapsed since this room has opened
   */
  elapsedMinutes = 0;

  /**
   * Groups of players per iteration
   */
  groups: Array<MatchmakingGroup> = [];

  /**
   * number of players in each game
   */
  numClientsToMatch = 5;

  /**
   * connected clients with additional priority, wait time, and confirmation metadata
   */
  clientStats: Array<ClientStat> = [];

  /**
   * determine if lobby should allow canned group assignment
   */
  devMode = false;

  /**
   * holds data for cron date
   */
  scheduler: any = undefined;

  async onCreate(options: any) {
    logger.info('RankedLobbyRoom: new room %s', this.roomId);
    this.setState(new LobbyRoomState());
    const settings = getServices().settings;
    this.groupAssignmentInterval = await settings.lobbyGroupAssignmentInterval();
    this.forceGroupAssignmentInterval = await settings.lobbyForceGroupAssignmentInterval();
    this.devMode = isDev();
    this.registerLobbyHandlers();

    /**
     * Redistribute clients into groups at every interval
     */
    this.scheduler = schedule.scheduleJob(
      `*/${this.groupAssignmentInterval} * * * *`,
      async () => {
        logger.trace('SCHEDULED JOB: REDISTRIBUTE GROUPS EVERY %d', this.groupAssignmentInterval);
        // force assign group with bots if its the last attempt in a scheduled window
        this.redistributeGroups();
        await this.updateLobbyNextAssignmentTime();
      }
    );
    this.updateLobbyNextAssignmentTime();
  }

  onDispose() {
    logger.trace('RankedLobbyRoom: disposing of %s, no connected clients. Cleaning up scheduler.', this.roomId);
    if (this.scheduler) {
      this.scheduler.cancel();
    }
  }

  async updateLobbyNextAssignmentTime() {
    if (this.scheduler) {
      this.elapsedMinutes += this.groupAssignmentInterval;
      if (this.forceGroupAssignmentInterval > 0 && this.elapsedMinutes >= this.forceGroupAssignmentInterval) {
        this.elapsedMinutes = 0;
        // force start a game
        this.redistributeGroups(true);
        return;
      }
      const nextInvocation: any = this.scheduler
        .nextInvocation()
        .toDate()
        .getTime();
      logger.trace("next invocation: %s", nextInvocation);
      this.state.nextAssignmentTime = nextInvocation;
      const scheduleService = getServices().schedule;
      // const prevOpenState = this.state.isOpen
      const isLobbyOpen = await scheduleService.isLobbyOpen();
      // check if this is the last attempt
      // logger.debug("previous open state: %s current open state: %s", prevOpenState, this.state.isOpen);
      if (!isLobbyOpen) {
        // the lobby time window has closed, place all connected participants into games with bots if needed
        // and close this LobbyRoom down
        this.redistributeGroups(true);
      }
    }
  }

  async onAuth(client: Client, options: { token: string }, request?: http.IncomingMessage) {
    try {
      const user = await getServices().account.findUserById((request as any).session.passport.user);
      if (user.isBanned) {
        logger.info('Banned user %s attempted to join the lobby', user.username);
        return false;
      }
      return user;
    } catch (e) {
      logger.fatal('Unable to authenticate client: %s', e);
    }
    return false;
  }

  async onJoin(client: Client, options: any, auth: any) {
    // FIXME: need to consider how this will scale and adjust if we go to the multiple-process Colyseus route, we may
    // need to include process ID info in the Game table so we can find how many participants a given Colyseus process is servicing

    // guard against too many connections, check total number of participants + currently waiting participants against
    // the maxConnections threshold
    const sp = getServices();
    const roomId = await sp.game.getActiveGameRoomId(client.auth.id);
    if (roomId) {
      this.sendSafe(client, {
        kind: "join-existing-game"
      })
      logger.info('User %d joining existing game %s', client.auth.id, roomId)
      return;
    }
    const numberOfActiveParticipants = await sp.game.getNumberOfActiveParticipants();
    const maxConnections = await sp.settings.maxConnections();
    logger.debug("active participants: %d lobby clients: %d", numberOfActiveParticipants, this.clientStats.length);
    if (numberOfActiveParticipants + this.clientStats.length > maxConnections) {
      // abort the connection and send an error message to the client
      this.sendSafe(client, { kind: 'join-failure', reason: 'Sorry, Port of Mars is currently full! Please try again later.' });
      return;
    }
    const userAlreadyInLobby = this.clientStats.filter(cs => cs.client.auth.id === client.auth.id).length > 0;
    if (userAlreadyInLobby) {
      this.sendSafe(client, {
        kind: "join-failure",
        reason: "You are already in the lobby. Please check your other browser windows."
      })
      return;
    }
    // check if user has an invite to a tournament other than the open beta tournament
    // FIXME: handle clients with an invite differently than open beta players
    const hasInvite = await sp.auth.checkUserHasTournamentInvite(auth.id);
    if (hasInvite) logger.debug("user: %s has invite to a tournament", auth.id);
    const clientStat = {
      client: client,
      rank: options.rank,
      waitingTime: 0,
      hasInvite,
      options
    };
    this.clientStats.push(clientStat);
    this.state.waitingUserCount = this.clientStats.length;
    this.sendSafe(client, { kind: 'joined-client-queue', value: true });
    // first come first serve semantics, allocate groups as soon as we have enough people to allocate
    if (this.clientStats.length >= this.numClientsToMatch) {
      this.redistributeGroups();
    }
  }

  registerLobbyHandlers(): void {
    this.onMessage('accept-invitation', (client, message: AcceptInvitation) => {
      logger.trace('CLIENT ACCEPTED INVITATION');
      const clientStat = this.clientStats.find(stat => stat.client === client);
      if (clientStat?.group) {
        const group = clientStat.group;
        if (!clientStat.confirmed) {
          clientStat.confirmed = true;
          group.confirmed++;
        }
        //check if this group's confirmed count matches the total number of clients it is managing
        if (group.hasConfirmedAllClients()) {
          // if so, let's disconnect all clients from this lobby room so they can connect to their
          // unique game instance
          // stat.group.cancelConfirmationTimeout!.clear();
          group.clientStats.forEach(clientStat => {
            const client = clientStat.client;
            this.removeClientStat(client);
            this.sendSafe(client, { kind: 'removed-client-from-lobby' });
            client.leave();
          });
          // now remove this group from the list of groups maintained by the Lobby
          this.removeGroup(group);
        }
      }
    });
    this.onMessage('distribute-groups', (client: Client, message: DistributeGroups) => {
      if (this.devMode) {
        logger.debug("client requested force distribute groups");
        this.redistributeGroups(true).then(() => logger.debug("Groups redistributed"));
      }
    });
  }

  removeGroup(group: MatchmakingGroup): void {
    const groupIndex = this.groups.indexOf(group);
    this.groups.splice(groupIndex, 1);
  }

  onLeave(client: Client, consented: boolean): void {
    logger.trace('WAITING LOBBY: onLeave %s', client.id);
    this.removeClientStat(client);
  }

  createGroup(): MatchmakingGroup {
    logger.trace('WAITING LOBBY: createGroup');
    const group = new MatchmakingGroup();
    this.groups.push(group);
    return group;
  }

  async redistributeGroups(force=false) {
    logger.trace('WAITING LOBBY:redistributeGroups: allocating connected clients to groups', this.clientStats);
    if (this.clientStats.length === 0) {
      logger.trace("WAITING LOBBY: not redistributing groups, no connected clients")
      return;
    }
    // Re-set all groups
    const shuffledClientStats = _.shuffle(this.clientStats);
    this.groups = [];
    let currentGroup = this.createGroup();
    for (const clientStat of shuffledClientStats) {
      clientStat.waitingTime += this.clock.deltaTime;
      // do not attempt to re-assign groups for clients inside "ready" groups
      if (clientStat.group && clientStat.group.ready) {
        continue;
      }
      // Create a new group if the current group is full.
      if (currentGroup.isFull(this.numClientsToMatch)) {
        currentGroup = this.createGroup();
      }
      // register this ClientStat with the current MatchmakingGroup
      clientStat.group = currentGroup;
      currentGroup.clientStats.push(clientStat);
    }
    await this.checkGroupsReady(force);
  }

  sendSafe(client: Client, msg: WaitingResponses) {
    client.send(msg.kind, msg);
  }

  async fillUsernames(usernames: Array<string>) {
    // if there aren't enough users, create bots to fill in
    if (usernames.length < this.numClientsToMatch) {
      const requiredBots = this.numClientsToMatch - usernames.length;
      const bots = await getServices().account.getOrCreateBotUsers(requiredBots);
      return usernames.concat(bots.map(u => u.username)).slice(0, this.numClientsToMatch);
    }
    return usernames;
  }

  isGroupReady(group: MatchmakingGroup): boolean {
    logger.trace('WAITING LOBBY: isGroupReady %o',{ ready: group.ready, length: group.clientStats.length });
    return group.ready || group.clientStats.length === this.numClientsToMatch;
  }

  async checkGroupsReady(force: boolean) {
    for (const group of this.groups) {
      logger.trace('WAITING LOBBY: checking group %o', group);
      if (this.isGroupReady(group) || force) {
        logger.debug('WAITING LOBBY: group was ready, creating room');
        group.ready = true;
        group.confirmed = 0;
        // FIXME: for dev mode, make sure there are at least 5 valid usernames after taking into account
        // connected usernames
        const usernames = _.shuffle(await this.fillUsernames(group.clientStats.map(s => s.client.auth.username)));
        // build game options to register the usernames and persister with a newly created room
        const gameOpts = await buildGameOpts(usernames);
        // Create room instance in the server.
        const room = await matchMaker.createRoom(
          GameRoom.NAME,
          gameOpts
        );
        logger.debug('WAITING LOBBY: created room %o', room);
        await Promise.all(
          group.clientStats.map(async client => {
            logger.debug('sending roomId', room.roomId, ' for client', client);
            // Send room data for new WebSocket connection
            this.sendSafe(client.client, {
              kind: 'sent-invitation',
              roomId: room.roomId
            });
          })
        );
      }
    }
  }

  removeClientStat(client: Client) {
    const index = this.clientStats.findIndex(stat => stat.client === client);
    if (index > -1) {
      logger.trace('WAITING LOBBY: removing client stat ', client.id);
      this.clientStats.splice(index, 1);
      this.state.waitingUserCount = this.clientStats.length;
    }
  }

}
