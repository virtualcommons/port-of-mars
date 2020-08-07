<template>
  <div class="lobby container">
    <div class="wrapper row">
      <div class="content col-12">
        <h3 class="m-5">Next Game Time: {{ nextAssignmentTimeString }}</h3>
        <b-row class="m-5">
          <b-col
            :key="role"
            class="m-5 avatar"
            v-for="role of roles"
          >
            <div :style="borderStyle(role)" class="avatar-border">
              <div :style="frameColor(role)" class="frame">
                <img :src="playerRoleImage(role)" alt="Player Image"/>
              </div>
            </div>
            <p class="p-3 text-center">{{ role }}</p>
          </b-col>
        </b-row>

<!--        <p>{{ joinedText }}</p>-->
        <p>{{ waitingUserCount }}/5 players ready</p>
        <b-spinner
          :label="'Loading...'"
          :variant="'warning'"
        ></b-spinner>
<!--        <b-button-group>-->
          <b-button :to="'tutorial'" variant="warning">Take Tutorial</b-button>
          <b-button @click="distributeGroups" variant="danger">
            Distribute Groups
          </b-button>
<!--        </b-button-group>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Prop, Vue} from 'vue-property-decorator';
  import {LOBBY_NAME} from '@port-of-mars/shared/lobby';
  import {Client} from 'colyseus.js';
  import {applyWaitingServerResponses} from '@port-of-mars/client/api/lobby/response';
  import {WaitingRequestAPI} from '@port-of-mars/client/api/lobby/request';
  import {DASHBOARD_PAGE} from '@port-of-mars/shared/routes';
  import moment from 'moment';
  import {Role} from '@port-of-mars/shared/types';

  @Component({})
  export default class Lobby extends Vue {
    @Inject() $client!: Client;
    @Prop() private role!: string;
    private lobbyAPI: WaitingRequestAPI = new WaitingRequestAPI();
    private waitingUserCount: number = 0;
    private joinedQueue: boolean = false;
    private nextAssignmentTime: number = new Date().getTime();

    get roles() {
      return this.$tstore.getters.roles;
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

    async created() {
      try {
        const room = await this.$client.joinOrCreate(LOBBY_NAME);
        applyWaitingServerResponses(room, this);
        this.lobbyAPI.connect(room);
      } catch (e) {
        /*
        if (e instanceof MatchMakeError) {
          this.$tstore.commit('SET_DASHBOARD_MESSAGE', { kind: 'danger', message: `Couldn't join the lobby: ${e.message}` });
        }
        */
        let errorMessage = e.message;
        if (!errorMessage) {
          errorMessage = 'Please complete all onboarding items on your dashboard before joining a game.';
        }
        this.$tstore.commit('SET_DASHBOARD_MESSAGE', {kind: 'warning', message: errorMessage});
        await this.$router.push({name: DASHBOARD_PAGE});
      }
    }

    async destroyed() {
      this.lobbyAPI.leave();
    }

    playerRoleImage(role: Role): any {
      return require(`@port-of-mars/client/assets/characters/${role}.png`);
    }

    frameColor(role: Role): object {
      return {backgroundColor: `var(--color-${role})`};
    }

    borderStyle(role: Role) {
      return {border: `0.125rem solid var(--color-${role})`};
    }

    private distributeGroups() {
      this.lobbyAPI.distributeGroups();
    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/views/Lobby.scss';
</style>
