<template>
  <div class="c-waiting-lobby container">
    <div class="wrapper row">
      <div class="content col-12">
        <p>THIS PAGE IS TEMPORARY, WILL BE REMOVED</p>
        <p>Next Assignment Time: {{ nextAssignmentTimeString }}</p>
        <p>Currently Waiting: {{ waitingUserCount }}</p>
        <p>{{ joinedText }}</p>
        <router-link :to="'tutorial'">
          <span class="continue">Take the tutorial</span>
        </router-link>
        <button @click="distributeGroups" type="button" name="button">
          Distribute Groups
        </button>
      </div>
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

  private distributeGroups() {
    this.lobbyAPI.distributeGroups();
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
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/WaitingLobby.scss';
</style>
