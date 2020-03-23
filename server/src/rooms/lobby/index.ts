import { Room, Client, matchMaker } from 'colyseus';
import schedule from 'node-schedule';
import { ROLES } from '@port-of-mars/shared/types';
import { buildGameOpts } from '@port-of-mars/server/util';
import { LobbyRoomState } from '@port-of-mars/server/rooms/lobby/state';
import { settings } from "@port-of-mars/server/settings";
import { findUserById } from "@port-of-mars/server/services/account";
import _ from "lodash";
import * as http from "http";
import { WaitingRequests } from "@port-of-mars/shared/lobby/requests";
import { WaitingResponses } from "@port-of-mars/shared/lobby/responses";
import { Persister } from "@port-of-mars/server/rooms/game/types";

const logger = settings.logging.getLogger(__filename);

class MatchmakingGroup {
  clientStats: Array<ClientStat> = [];
  ready: boolean = false;
  confirmed: number = 0;

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

  /**
   * Distribute clients into groups at this interval
   * currently set to 15 minutes
   */
  evaluateAtEveryMinute = 15;

  /**
   * Groups of players per iteration
   */
  groups: Array<MatchmakingGroup> = [];

  /**
   * name of the room to create
   */
  roomToCreateName = 'port_of_mars_game';

  /**
   * number of players in each game
   */
  numClientsToMatch = 5;

  /**
   * connected clients with additional priority, wait time, and confirmation metadata
   */
  clientStats: Array<ClientStat> = [];

  /**
   * determine if lobby should force group assignment
   */
  dev = false;

  persister!: Persister;

  /**
   * holds data for cron date
   */
  scheduler: any = undefined;

  onCreate(options: any) {
    this.setState(new LobbyRoomState());
    this.dev = options.dev;
    this.persister = options.persister;
    this.evaluateAtEveryMinute = settings.lobby.evaluateAtEveryMinute;

    /**
     * Redistribute clients into groups at every interval
     */
    this.scheduler = schedule.scheduleJob(
      `*/${this.evaluateAtEveryMinute} * * * *`,
      () => {
        logger.trace('SCHEDULED JOB: REDISTRIBUTE GROUPS');
        this.redistributeGroups();
        this.updateLobbyNextAssignmentTime();
      }
    );
    this.updateLobbyNextAssignmentTime();
  }

  updateLobbyNextAssignmentTime() {
    if (this.scheduler) {
      const nextInvocation: any = this.scheduler
        .nextInvocation()
        .toDate()
        .getTime();
      this.state.nextAssignmentTime = nextInvocation;
    }
  }

  async onAuth(client: Client, options: any, request: http.IncomingMessage) {
    logger.info("trying to authenticate client", client);
    const userId = (request as any).session.passport.user;
    logger.info("current session has user id ", userId);
    return await findUserById(userId);
  }

  onJoin(client: Client, options: any) {
    const clientStat = {
      client: client,
      rank: options.rank,
      waitingTime: 0,
      options
    };
    this.clientStats.push(clientStat);
    this.state.waitingUserCount = this.clientStats.length;
    this.sendSafe(client, { kind: 'joined-client-queue', value: true });
    if (this.dev && this.clientStats.length === this.numClientsToMatch) {
      this.redistributeGroups();
    }
  }

  async onMessage(client: Client, message: WaitingRequests) {
    logger.trace('WAITING LOBBY: onMessage - message', message);
    if (message.kind === 'accept-invitation') {
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
            client.close();
          });
        }
      }
    }
    else if (message.kind === 'distribute-groups') {
      await this.redistributeGroups();
    }
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

  async redistributeGroups() {
    logger.trace('WAITING LOBBY: allocating connected clients to groups', this.clientStats);
    // Re-set all groups
    this.groups = [];
    let currentGroup = this.createGroup();
    const shuffledClientStats = _.shuffle(this.clientStats);
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
    await this.checkGroupsReady();
  }

  sendSafe(client: Client, msg: WaitingResponses) {
    this.send(client, msg);
  }

  fillUsernames(usernames: Array<string>) {
    // in development mode, allow for less than 5 usernames and fill in 
    if (usernames.length < ROLES.length && this.dev) {
      const newUsernames = ['bob1', 'amanda1', 'adison1', 'sydney1', 'frank1'].filter(u => !usernames.includes(u));
      return usernames.concat(newUsernames).slice(0, this.numClientsToMatch);
    }

    return usernames;
  }

  isGroupReady(group: MatchmakingGroup): boolean {
    return group.ready || group.clientStats.length === this.numClientsToMatch || this.dev;
  }

  async checkGroupsReady() {
    for (const group of this.groups) {
      logger.trace('WAITING LOBBY: checking group ', group)
      if (this.isGroupReady(group)) {
        logger.debug('WAITING LOBBY: group was ready, creating room');
        group.ready = true;
        group.confirmed = 0;
        // FIXME: for dev mode, make sure there are at least 5 valid usernames after taking into account
        // connected usernames
        const usernames = this.fillUsernames(group.clientStats.map(s => s.client.auth.username));
        // build game options to register the usernames and persister with a newly created room
        const gameOpts = await buildGameOpts(usernames, this.persister);
        // Create room instance in the server.
        const room = await matchMaker.createRoom(
          this.roomToCreateName,
          gameOpts
        );
        logger.debug('WAITING LOBBY: created room ', room);
        await Promise.all(
          group.clientStats.map(async client => {
            const reservation = await matchMaker.reserveSeatFor(
              room,
              client.options
            );
            logger.debug("created reservation for client ", reservation);
            // Send room data for new WebSocket connection
            this.sendSafe(client.client, {
              kind: 'sent-invitation',
              reservation: reservation
            });
          })
        );
      }
    }
  }

  removeClientStat(client: Client) {
    logger.trace('WAITING LOBBY: removing client stat ', client);
    const index = this.clientStats.findIndex(stat => stat.client === client);
    if (index !== -1) {
      this.clientStats.splice(index, 1);
      this.state.waitingUserCount = this.clientStats.length;
    }
  }

}
