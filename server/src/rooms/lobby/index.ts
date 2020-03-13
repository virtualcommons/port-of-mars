import { Room, Client, matchMaker } from 'colyseus';
import schedule from 'node-schedule';
import { ROLES } from '@port-of-mars/shared/types';
import { buildGameOpts } from '@port-of-mars/server/util';
import { RoomGameState } from '@port-of-mars/server/rooms/lobby/state';
import { settings } from "@port-of-mars/server/settings";
import { findUserById } from "@port-of-mars/server/services/account";
import * as http from "http";
import { WaitingRequests } from "@port-of-mars/shared/lobby/requests";
import { isDev } from "@port-of-mars/shared/settings";
import { WaitingResponses } from "@port-of-mars/shared/lobby/responses";
import { Persister } from "@port-of-mars/server/rooms/game/types";

const logger = settings.logging.getLogger(__filename);

interface MatchmakingGroup {
  stats: ClientStat[];
  priority?: boolean;
  ready?: boolean;
  confirmed?: number;
}

interface ClientStat {
  client: Client;
  waitingTime: number;
  options?: any;
  group?: MatchmakingGroup;
  rank: number;
  confirmed?: boolean;
}

export class RankedLobbyRoom extends Room<RoomGameState> {

  /**
   * Distribute clients into groups at this interval
   * 15 minutes
   */
  evaluateAtEveryMinute = 15;

  /**
   * Groups of players per iteration
   */
  groups: MatchmakingGroup[] = [];

  /**
   * name of the room to create
   */
  roomToCreate = 'game';

  /**
   * number of players on each match
   */
  numClientsToMatch = 5;

  /**
   * rank and group cache per-player
   */
  stats: ClientStat[] = [];

  /**
   * determine if lobby should force group assignment
   */
  dev: boolean = false;

  persister!: Persister;

  /**
   * holds data for cron date
   */
  scheduler: any = undefined;

  onCreate(options: any) {
    this.setState(new RoomGameState());
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

  async onAuth(client: Client, options: { token: string }, request?: http.IncomingMessage) {
    const user = await findUserById((request as any).session.passport.user);
    return user;
  }

  onJoin(client: Client, options: any) {
    const stat = {
      client: client,
      rank: options.rank,
      waitingTime: 0,
      options
    };
    this.stats.push(stat);
    this.state.waitingUserCount = this.stats.length;
    this.send(client, { kind: 'client-joined-queue', value: true });

    if (this.dev && this.stats.length === this.numClientsToMatch) {
      this.redistributeGroups();
    }
  }

  async onMessage(client: Client, message: WaitingRequests) {
    logger.trace('WAITING LOBBY: onMessage - message', message);
    if (message.kind === 'accept-invitation') {
      logger.trace('CLIENT ACCEPTED INVITATION');
      const stat = this.stats.find(stat => stat.client === client);

      if (stat && stat.group && typeof stat.group.confirmed === 'number') {
        if (!stat.confirmed) {
          stat.confirmed = true;
          stat.group.confirmed++;
        }

        /**
         * All clients confirmed, let's disconnect them!
         */
        if (stat.group.confirmed === stat.group.stats.length) {
          // stat.group.cancelConfirmationTimeout!.clear();
          stat.group.stats.forEach(stat => {
            this.removeClientStat(stat.client);
            this.sendSafe(stat.client, { kind: 'removed-client-from-lobby' });
            stat.client.close();
          });
        }
      }
    } else if (message.kind === 'distribute-groups') {
      this.redistributeGroups();
      await this.checkGroupsReady();
    }
  }

  onLeave(client: Client, consented: boolean) {
    logger.trace('WAITING LOBBY: onLeave');
    this.removeClientStat(client);
  }

  createGroup() {
    logger.trace('WAITING LOBBY: createGroup');
    let group: MatchmakingGroup = { stats: [] };
    this.groups.push(group);
    return group;
  }

  redistributeGroups() {
    logger.trace('WAITING LOBBY: redistributeGroups');
    // Re-set all groups
    this.groups = [];

    const stats = this.stats;

    let currentGroup: MatchmakingGroup = this.createGroup();

    for (let i = 0, l = stats.length; i < l; i++) {
      const stat = stats[i];
      stat.waitingTime += this.clock.deltaTime;

      /**
       * do not attempt to re-assign groups for clients inside "ready" groups
       */
      if (stat.group && stat.group.ready) {
        continue;
      }

      if (currentGroup.stats.length === this.numClientsToMatch) {
        currentGroup = this.createGroup();
      }

      stat.group = currentGroup;
      currentGroup.stats.push(stat);
    }

    this.checkGroupsReady();
  }

  checkGroupIsReady(group: MatchmakingGroup): boolean {
    return group.ready || group.stats.length === this.numClientsToMatch || isDev()
  }

  sendSafe(client: Client, msg: WaitingResponses) {
    this.send(client, msg);
  }

  fillUsernames(usernames: Array<string>) {
    if (usernames.length < ROLES.length && isDev()) {
      const newUsernames = ['bob1', 'amanda1', 'adison1', 'sydney1', 'frank1'].filter(u => !usernames.includes(u));
      return usernames.concat(newUsernames).slice(0, this.numClientsToMatch);
    }

    return usernames;
  }

  async checkGroupsReady() {
    logger.trace('WAITING LOBBY: checkGroupsReady');
    await Promise.all(
      this.groups.map(async group => {
        if (this.checkGroupIsReady(group)) {
          logger.debug('WAITING LOBBY: group is ready', group);
          group.ready = true;
          group.confirmed = 0;

          const usernames = this.fillUsernames(group.stats.map(s => s.client.auth.username));
          const gameOpts = await buildGameOpts(usernames, this.persister);
          /**
           * Create room instance in the server.
           */
          const room = await matchMaker.createRoom(
            this.roomToCreate,
            gameOpts
          );

          await Promise.all(
            group.stats.map(async client => {
              const matchData = await matchMaker.reserveSeatFor(
                room,
                client.options
              );

              /**
               * Send room data for new WebSocket connection!
               */
              this.sendSafe(client.client, {
                kind: 'sent-invitation',
                matchData: matchData
              });
            })
          );
        }
      })
    );
  }

  removeClientStat(client: Client) {
    logger.trace('WAITING LOBBY: removeClientStat');
    const index = this.stats.findIndex(stat => stat.client === client);
    if (index !== -1) {
      this.stats.splice(index, 1);
      this.state.waitingUserCount = this.stats.length;
    }
  }
}
