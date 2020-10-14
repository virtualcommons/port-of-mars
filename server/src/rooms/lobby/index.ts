import { Room, Client, matchMaker } from 'colyseus';
import schedule from 'node-schedule';
import { ROLES } from '@port-of-mars/shared/types';
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
}

export class RankedLobbyRoom extends Room<LobbyRoomState> {

  public static get NAME(): string { return LOBBY_NAME }

  /**
   * Distribute clients into groups at this interval
   * currently set to check for group assignment every 5 minutes
   */
  groupAssignmentInterval = 5;

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

  onCreate(options: any) {
    logger.info(`RankedLobbyRoom: new room ${this.roomId}`);
    this.setState(new LobbyRoomState());
    this.groupAssignmentInterval = settings.lobby.groupAssignmentInterval;
    this.devMode = settings.lobby.devMode;
    this.registerLobbyHandlers();

    /**
     * Redistribute clients into groups at every interval
     */
    this.scheduler = schedule.scheduleJob(
      `*/${this.groupAssignmentInterval} * * * *`,
      async () => {
        logger.trace('SCHEDULED JOB: REDISTRIBUTE GROUPS EVERY %d', this.groupAssignmentInterval);
        this.redistributeGroups();
        await this.updateLobbyNextAssignmentTime();
      }
    );
    this.updateLobbyNextAssignmentTime();
  }

  async updateLobbyNextAssignmentTime() {
    if (this.scheduler) {
      const nextInvocation: any = this.scheduler
        .nextInvocation()
        .toDate()
        .getTime();
      logger.trace("next invocation: %s", nextInvocation);
      this.state.nextAssignmentTime = nextInvocation;
      const tournamentService = getServices().tournament;
      this.state.isOpen = await tournamentService.isLobbyOpen();
    }
  }

  async onAuth(client: Client, options: { token: string }, request?: http.IncomingMessage) {
    try {
      const user = await getServices().account.findUserById((request as any).session.passport.user);
      logger.debug('checking if user %s can play the game', user.username);
      if (await getServices().auth.checkUserCanPlayGame(user.id)) {
        return user;
      }
      // FIXME: this won't work since we don't have any registered handlers to process this client-side
      // this.sendSafe(client, { kind: 'join-failure', reason: 'Please complete all onboarding items on your dashboard before joining a game.' });
      logger.debug('user should be redirected back to the dashboard');
    } catch (e) {
      logger.fatal(e);
    }
    return false;
  }

  async onJoin(client: Client, options: any) {
    // FIXME: need to consider how this will scale and adjust if we go to the multiple-process Colyseus route, we may
    // need to include process ID info in the Game table so we can find how many participants a given Colyseus process is servicing

    // guard against too many connections, check total number of participants + currently waiting participants against
    // the maxConnections threshold
    const sp = getServices();
    const numberOfActiveParticipants = await sp.game.getNumberOfActiveParticipants();
    const maxConnections = await sp.settings.getMaxConnections();
    logger.debug("active participants: %d lobby clients: %d", numberOfActiveParticipants, this.clientStats.length);
    if (numberOfActiveParticipants + this.clientStats.length > maxConnections) {
      // abort the connection and send an error message to the client
      this.sendSafe(client, { kind: 'join-failure', reason: 'Sorry, Port of Mars is currently full! Please try again later.' });
      return;
    }
    const clientStat = {
      client: client,
      rank: options.rank,
      waitingTime: 0,
      options
    };
    this.clientStats.push(clientStat);
    this.state.waitingUserCount = this.clientStats.length;
    this.sendSafe(client, { kind: 'joined-client-queue', value: true });
    // FIXME: first come first serve semantics, allocate groups as soon as we have enough people to allocate
    if (this.clientStats.length >= this.numClientsToMatch) {
      this.redistributeGroups();
    }
  }

  registerLobbyHandlers() {
    this.onMessage('accept-invitation', (client, message: AcceptInvitation) => {
      logger.trace('CLIENT ACCEPTED INVITATION');
      const clientStat = this.clientStats.find(stat => stat.client === client);
      if (clientStat?.group) {
        const group = clientStat.group;
        if (!clientStat.confirmed) {
          clientStat.confirmed = true;
          group.confirmed++;
        }
        /**
         * check if this group's confirmed count matches the total number of clients it is managing
         */
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

  removeGroup(group: MatchmakingGroup) {
    const groupIndex = this.groups.indexOf(group);
    this.groups.splice(groupIndex, 1);
  }

  onLeave(client: Client, consented: boolean) {
    logger.trace('WAITING LOBBY: onLeave');
    this.removeClientStat(client);
  }

  createGroup() {
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
      /**
       * do not attempt to re-assign groups for clients inside "ready" groups
       */
      if (clientStat.group && clientStat.group.ready) {
        continue;
      }
      /**
       * Create a new group if the current group is full.
       */
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

  fillUsernames(usernames: Array<string>) {
    // in development mode, allow for less than 5 usernames and fill in 
    if (usernames.length < ROLES.length && this.devMode) {
      const newUsernames = ['bob1', 'amanda1', 'adison1', 'sydney1', 'frank1'].filter(u => !usernames.includes(u));
      return usernames.concat(newUsernames).slice(0, this.numClientsToMatch);
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
        const usernames = _.shuffle(this.fillUsernames(group.clientStats.map(s => s.client.auth.username)));
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
