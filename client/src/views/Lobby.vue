<template>
  <div class="lobby container">
    <img
      :src="require(`@port-of-mars/client/assets/marsbg.jpg`)"
      alt="Background Image"
      class="background-image"
    />
    <div class="wrapper row">
      <div class="content col-12">
        <h3 class="m-5">Next Game Time: {{ nextAssignmentTimeString }}</h3>
        <b-row>
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
        <h4 class="mb-3">{{ waitingUserCount }}/5 PLAYERS READY</h4>
        <b-spinner
          :label="'Loading...'"
          :variant="variantStyle(waitingUserCount)"
          class="mb-4"
        ></b-spinner>

        <b-button-group class="w-25 mt-4" vertical>
          <b-button :to="'tutorial'" variant="outline-warning">
            Take Tutorial
          </b-button>
          <b-button @click="distributeGroups" variant="outline-warning">
            Join game
          </b-button>
        </b-button-group>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
  import {Client} from 'colyseus.js';
  import moment from 'moment';
  import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

  import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
  import {applyWaitingServerResponses} from '@port-of-mars/client/api/lobby/response';
  import {WaitingRequestAPI} from '@port-of-mars/client/api/lobby/request';
  import {LOBBY_NAME} from '@port-of-mars/shared/lobby';
  import {CONSENT_PAGE, TUTORIAL_PAGE, DASHBOARD_PAGE} from '@port-of-mars/shared/routes';
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
      const dashboardAPI = new DashboardAPI(this.$tstore, this.$ajax);
      const dashboardData = await dashboardAPI.getData();
      // check if player can play a game
      const playerTaskCompletion = dashboardData.playerTaskCompletion;
      // FIXME: repeated logic from Dashboard.vue
      // go to email verification page if player is not verified
      if (playerTaskCompletion.mustVerifyEmail) {
        await this.$router.push({name: CONSENT_PAGE});
        return;
      }
      // go to consent page if player has not consented
      else if (playerTaskCompletion.mustConsent) {
        await this.$router.push({name: CONSENT_PAGE});
        return;
      }
      // go to tutorial if player has not taken tutorial
      else if (playerTaskCompletion.mustTakeTutorial) {
        dashboardAPI.message('Please take the tutorial before joining the lobby to participate.');
        await this.$router.push({name: TUTORIAL_PAGE});
        return;
      }
      else if (playerTaskCompletion.mustTakeIntroSurvey) {
        dashboardAPI.message('Please take the introductory survey before joining the lobby to participate.');
        await this.$router.push({name: DASHBOARD_PAGE});
        return;
      }
      if (! playerTaskCompletion.canPlayGame) {
        dashboardAPI.message('You do not currently have an active Port of Mars invitation. Please contact us if this is an error.');
        await this.$router.push({name: DASHBOARD_PAGE});
        return;
      }
      // check if there is a game scheduled for play
      if (! dashboardData.isLobbyOpen) {
        dashboardAPI.message('You can only join the lobby a half hour before a game is scheduled to start. Please try again later.');
        await this.$router.push({name: DASHBOARD_PAGE});
        return;
      }
      // all checks passed, actually join the lobby
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

    private variantStyle(ready: number): string {
      if (ready < 4) return 'warning';
      else return 'success';
    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/views/Lobby.scss';
</style>
