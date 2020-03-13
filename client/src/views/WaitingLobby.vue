<template>
  <div :class="animations('waiting-lobby')" class="waiting-lobby">
    <div class="container">
      <div class="top">
        <div class="character">
          <div :class="animations('frame')" class="frame">
            <img
              class="image"
              :src="require(`@port-of-mars/client/assets/characters-large/${this.playerRole}.png`)"
              alt="Player"
            />
          </div>
          <p>{{ playerRole }}</p>
        </div>
        <div class="right">
          <div class="wrapper">
            <div class="hint">
              <p>{{ hint }}</p>
            </div>
          </div>
          <div class="loading-progress">
            <p class="progress-text">86<span>%</span></p>
            <router-link :to="'game'">
              <span class="continue">Continue to Game</span>
            </router-link>
          </div>
          <p>Next Assignment Time: {{ nextAssignmentTimeString }}</p>
          <p>Currently Waiting: {{ waitingUserCount }}</p>
          <p>{{ joinedText }}</p>
          <button
            @click="distributeGroups"
            type="button"
            name="button"
          >
              Distribute Groups
          </button>
        </div>
      </div>
      <div class="bottom">
        <div v-for="role in otherRoles" class="character">
          <div class="frame">
            <img
              class="image"
              :src="require(`@port-of-mars/client/assets/characters-large/${role}.png`)"
              alt="Player"
            />
          </div>
          <p>{{ role }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {isDev} from '@port-of-mars/shared/settings';
import { Vue, Component, Inject } from 'vue-property-decorator';
import { ROLES } from '@port-of-mars/shared/types';
import { Client } from 'colyseus.js';
import { applyWaitingServerResponses } from '@port-of-mars/client/api/waitingLobby/response';
import { WaitingRequestAPI } from '@port-of-mars/client/api/waitingLobby/request';
import moment from 'moment';

@Component({})
export default class WaitingLobby extends Vue {
  @Inject() $client!: Client;

  waitingUserCount: number = 0;
  joinedQueue: boolean = false;
  nextAssignmentTime: number = (new Date()).getTime();

  private lobbyAPI: WaitingRequestAPI = new WaitingRequestAPI();
  private hint: string = '';
  private hintCount: number = 0;
  private hints: Array<string> = [
    'Nulla consequat tincidunt elit vitae lacinia. Duis in dui sed sapien lobortis consectetur ac non massa. In nisl ex, aliquam at libero non, malesuada pulvinar ex. Nam tempor, sapien quis.',
    'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean vel quam vitae risus interdum auctor vel in mi. Sed sem velit, sollicitudin eu risus ut.',
    'Fusce tempor porta rhoncus. In molestie elit at porttitor faucibus. Sed vel tortor sed ipsum tincidunt sagittis. Nunc vestibulum lacinia rhoncus. Ut sodales consequat ipsum, eu luctus ipsum luctus non.',
    'Morbi at tellus convallis quam viverra sodales. Praesent tincidunt felis semper ipsum maximus rhoncus. Suspendisse potenti. Duis viverra nisi lectus, vel porta nisl varius vitae. Ut quis magna eget quam.',
    'Etiam porta commodo neque, eu faucibus purus. Donec quis dui maximus, volutpat erat vitae, laoreet ligula. Pellentesque accumsan laoreet justo id vehicula. Nullam consectetur, enim eu tincidunt sagittis, mi odio.'
  ];

  async created() {
    const room = await this.$client.joinOrCreate('waiting');
    applyWaitingServerResponses(room, this);
    this.lobbyAPI.connect(room);
  }

  async destroyed() {
    console.log('leaving lobby');
    this.lobbyAPI.room.leave();
  }

  mounted() {
    this.hint = this.hints[this.hintCount];
    setInterval(() => {
      if (this.hintCount < this.hints.length - 1) {
        this.hintCount++;
      } else {
        this.hintCount = 0;
      }
      this.hint = this.hints[this.hintCount];
    }, 8000);
  }

  isDev() {
    return isDev();
  }

  get playerRole() {
    return this.$tstore.state.role;
  }

  get otherRoles() {
    const pr = this.playerRole;
    return ROLES.filter(role => role !== pr);
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

  distributeGroups() {
    this.lobbyAPI.distributeGroups();
  }

  private animations(el: string): string {
    switch (el) {
      case 'waiting-lobby':
        // return 'animated fadeInDown delay-1s';
        break;
      case 'frame':
        // return 'animated pulse slow infinite';
        break;
      default:
        return '';
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/fading_entrances/fadeInDown.css';
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/views/WaitingLobby.scss';
</style>
