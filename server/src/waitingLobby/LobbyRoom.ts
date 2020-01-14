import { Room, Client, matchMaker } from "colyseus";

interface MatchmakingGroup {
  stats: ClientStat[],
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

export class RankedLobbyRoom extends Room {
  /**
   * Distribute clients into groups at this interval
   * 15 minutes
   */
  evaluateGroupsInterval = 15 * 60 * 1000;

  /**
   * Groups of players per iteration
   */
  groups: MatchmakingGroup[] = [];

  /**
   * name of the room to create
   */
  roomToCreate = "game";

  /**
   * number of players on each match
   */
  numClientsToMatch = 5;

  /**
   * rank and group cache per-player
   */
  stats: ClientStat[] = [];

  onCreate(options: any) {
    /**
     * Redistribute clients into groups at every interval
     */
    this.setSimulationInterval(() => this.redistributeGroups(), this.evaluateGroupsInterval);
  }

  async onAuth() {
    /**
     * Validate CAS authentication here.
     */
    return new Promise((resolve) => resolve(true));
  }

  onJoin(client: Client, options: any) {
    this.stats.push({
      client: client,
      rank: options.rank,
      waitingTime: 0,
      options
    });

    this.send(client, 1);
  }

  onMessage(client: Client, message: any) {
    if (message === 1) {
      const stat = this.stats.find(stat => stat.client === client);

      if (stat && stat.group && typeof(stat.group.confirmed) === "number") {
        stat.confirmed = true;
        stat.group.confirmed++;

        /**
         * All clients confirmed, let's disconnect them!
         */
        if (stat.group.confirmed === stat.group.stats.length) {
          // stat.group.cancelConfirmationTimeout!.clear();
          stat.group.stats.forEach(stat => {
            this.removeClientStat(stat.client);
            stat.client.close();
          });
        }
      }
    }
  }

  createGroup() {
    let group: MatchmakingGroup = { stats: [] };
    this.groups.push(group);
    return group;
  }

  redistributeGroups() {
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
    await Promise.all(
      this.groups
        .map(async (group) => {
          if (group.ready || group.stats.length === this.numClientsToMatch) {
            group.ready = true;
            group.confirmed = 0;

            /**
             * Create room instance in the server.
             */
            const room = await matchMaker.createRoom(this.roomToCreate, {});

            await Promise.all(group.stats.map(async (client) => {
              const matchData = await matchMaker.reserveSeatFor(room, client.options);

              /**
               * Send room data for new WebSocket connection!
               */
              this.send(client.client, matchData);
            }));

          } else {
            /**
             * Notify all clients within the group on how many players are in the queue
             */
            group.stats.forEach(client => this.send(client.client, group.stats.length));
          }
        })
    );
  }

  removeClientStat(client: Client) {
    const index = this.stats.findIndex(stat => stat.client === client);
    if (index !== -1) {
      this.stats.splice(index, 1);
    }
  }

  onLeave(client: Client, consented: boolean) {
    this.removeClientStat(client);
  }

  onDispose() {
  }

}
