<template>
  <div class="waiting-lobby w-100 h-100 p-3">
    <div
      class="w-100 h-100 d-flex flex-column justify-content-center align-items-center"
    >
      <p>Next Assignment Time: {{ nextAssignmentTimeString }}</p>
      <p>Currently Waiting: {{ waitingUserCount }}</p>
      <p>{{ joinedText }}</p>
      <p>
        <router-link :to="'tutorial'">
          <span class="continue">Take the tutorial</span>
        </router-link>
      </p>
      <button @click="distributeGroups" type="button" name="button">
        Distribute Groups
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { LOBBY_NAME } from '@port-of-mars/shared/lobby';
import { Client } from 'colyseus.js';
import { applyWaitingServerResponses } from '@port-of-mars/client/api/lobby/response';
import { WaitingRequestAPI } from '@port-of-mars/client/api/lobby/request';
import moment from 'moment';

@Component({})
export default class WaitingLobby extends Vue {
  @Inject() $client!: Client;
  private lobbyAPI: WaitingRequestAPI = new WaitingRequestAPI();
  private waitingUserCount: number = 0;
  private joinedQueue: boolean = false;
  private nextAssignmentTime: number = new Date().getTime();

  async created() {
    const room = await this.$client.joinOrCreate(LOBBY_NAME);
    applyWaitingServerResponses(room, this);
    this.lobbyAPI.connect(room);
  }

  async destroyed() {
    this.lobbyAPI.room.leave();
  }

  get nextAssignmentTimeString(): string {
    const unformatted = this.nextAssignmentTime;
    const formatted = moment(unformatted).format('LLL');
    return formatted;
  }

  get joinedText(): string {
    const lobbyClientJoinedQueue = this.joinedQueue;
    if (lobbyClientJoinedQueue) {
      return 'You are currently in line for a game';
    }
    return 'You have not yet been added to the game queue.';
  }

  private distributeGroups() {
    this.lobbyAPI.distributeGroups();
  }
}
</script>

<style lang="scss" scoped>
.waiting-lobby {
  color: $space-white;
}
</style>
