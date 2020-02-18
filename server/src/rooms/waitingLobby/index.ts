import { Room, Client, matchMaker } from 'colyseus';
import schedule from 'node-schedule';
import { ROLES } from 'shared/types';
import _ from 'lodash';
import { buildGameOpts } from '@/util';
import { getUserByJWT } from '@/services/account';
import { RoomGameState } from '@/rooms/waitingLobby/state';

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

  /**
   * holds data for cron date
   */
  scheduler: any = undefined;

  onCreate(options: any) {
    console.log('WAITING LOBBY: onCreate');
    this.setState(new RoomGameState());
    this.dev = options.dev;
    /**
     * Redistribute clients into groups at every interval
     */
    this.scheduler = schedule.scheduleJob(
      `*/${this.evaluateAtEveryMinute} * * * *`,
      () => {
        console.log('SCHEDULED JOB: REDISTRIBUTE GROUPS');
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
      this.state.lobbyNextAssignmentTime = nextInvocation;
    }
  }

  async onAuth(client: Client, options: { token: string }) {
    console.log('WAITING LOBBY: onAuth');
    // TODO: Handle Authentication

    // const user = await getUserByJWT(options.token);
    // if (user && Object.keys(this.state.userRoles).includes(user.username)) {
    //   return user;
    // }
    // return false;

    return true;
  }

  onJoin(client: Client, options: any) {
    console.log('WAITING LOBBY: onJoin');
    const stat = {
      client: client,
      rank: options.rank,
      waitingTime: 0,
      options
    };
    this.stats.push(stat);
    this.state.lobbyWaitingUsers = this.stats.length;
    this.send(client, { kind: 'client-joined-queue', value: true });

    if (this.dev && this.stats.length === this.numClientsToMatch) {
      this.redistributeGroups();
    }
  }

  onMessage(client: Client, message: any) {
    console.log('WAITING LOBBY: onMessage');
    console.log('WAITING LOBBY: onMessage - message', message);
    if (message.kind === 'accept-invitation') {
      console.log('CLIENT ACCEPTED INVITATION');
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
            this.send(stat.client, { kind: 'client-remove-from-lobby' });
            stat.client.close();
          });
        }
      }
    }
  }

  createGroup() {
    console.log('WAITING LOBBY: createGroup');
    let group: MatchmakingGroup = { stats: [] };
    this.groups.push(group);
    return group;
  }

  redistributeGroups() {
    console.log('WAITING LOBBY: redistributeGroups');
    // Re-set all groups
    this.groups = [];

    // const stats = this.stats.sort((a, b) => a.rank - b.rank);
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

  async checkGroupsReady() {
    console.log('WAITING LOBBY: checkGroupsReady');
    await Promise.all(
      this.groups.map(async group => {
        if (group.ready || group.stats.length === this.numClientsToMatch) {
          group.ready = true;
          group.confirmed = 0;

          const userRoles = buildGameOpts(
            group.stats.map(s => s.client.auth.username)
          );
          /**
           * Create room instance in the server.
           */
          const room = await matchMaker.createRoom(
            this.roomToCreate,
            userRoles
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
              this.send(client.client, {
                kind: 'send-invitation',
                matchData: matchData
              });
            })
          );
        } else {
          /**
           * Notify all clients within the group on how many players are in the queue
           */
          // group.stats.forEach(client =>
          //   this.send(client.client, group.stats.length)
          // );
        }
      })
    );
  }

  removeClientStat(client: Client) {
    console.log('WAITING LOBBY: removeClientStat');
    const index = this.stats.findIndex(stat => stat.client === client);
    if (index !== -1) {
      this.stats.splice(index, 1);
      this.state.lobbyWaitingUsers = this.stats.length;
    }
  }

  onLeave(client: Client, consented: boolean) {
    console.log('WAITING LOBBY: onLeave');
    this.removeClientStat(client);
  }

  onDispose() {
    console.log('WAITING LOBBY: onDispose');
  }
}
