<template>
  <div class="lobby container">
    <div class="wrapper row">
      <div class="content col-12">
        <h3 class="m-5">Next Game: <mark>{{ scheduledGameTimeString }}</mark></h3>
        <!--<h4>Groups will be assigned in <mark>{{ nextAssignmentTimeString }}</mark> minutes.</h4>-->
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

        <h4 class="mb-3">{{ waitingUserCount }} PLAYER(S) READY</h4>
        <b-alert show class="w-50" variant="info">
          You'll join a game as soon as there are enough players to form a full group. The lobby will remain open up to 30 minutes after
          the scheduled game time.
        </b-alert>
        <b-spinner
          :label="'Loading...'"
          :variant="variantStyle(waitingUserCount)"
          class="mb-4"
        ></b-spinner>

        <b-button-group class="w-25 mt-4" vertical>
          <b-button :to="'tutorial'" variant="secondary">
            Take Tutorial
          </b-button>
          <b-button :to="'dashboard'" variant="secondary">
            Return to the Dashboard
          </b-button>
          <b-button v-if="isDevOrStaging" @click="distributeGroups" variant="secondary">
            Join game
          </b-button>
        </b-button-group>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
  import {Client} from 'colyseus.js';
  import {Component, Inject, Prop, Vue} from 'vue-property-decorator';

  import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
  import {applyWaitingServerResponses} from '@port-of-mars/client/api/lobby/response';
  import {WaitingRequestAPI} from '@port-of-mars/client/api/lobby/request';
  import {isDevOrStaging} from '@port-of-mars/shared/settings';
  import {LOBBY_NAME} from '@port-of-mars/shared/lobby';
  import {REGISTER_PAGE, TUTORIAL_PAGE, DASHBOARD_PAGE} from '@port-of-mars/shared/routes';
  import {Role} from '@port-of-mars/shared/types';

  @Component({})
  export default class Lobby extends Vue {
    @Inject() $client!: Client;
    @Prop() private role!: string;
    private lobbyAPI: WaitingRequestAPI = new WaitingRequestAPI();
    private waitingUserCount: number = 0;
    private nextAssignmentTime: number = 0;
    private scheduledGameTime: number = 0;

    get roles() {
      return this.$tstore.getters.roles;
    }

    get scheduledGameTimeString(): string {
      return new Date(this.scheduledGameTime).toString();
    }

    get nextAssignmentTimeString(): string {
      return new Date(this.nextAssignmentTime).toString();
    }

    get isDevOrStaging() {
      return isDevOrStaging();
    }

    async created() {
      const dashboardAPI = new DashboardAPI(this.$tstore, this.$ajax);
      const dashboardData = await dashboardAPI.getData();
      // check if player can play a game
      const playerTaskCompletion = dashboardData.playerTaskCompletion;
      // FIXME: repeated logic from Dashboard.vue
      // go to email verification page if player is not verified
      if (playerTaskCompletion.mustVerifyEmail) {
        await this.$router.push({name: REGISTER_PAGE});
        return;
      }
      // go to consent page if player has not consented
      else if (playerTaskCompletion.mustConsent) {
        await this.$router.push({name: REGISTER_PAGE});
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
        dashboardAPI.message('You can join the lobby 10 minutes before a game is scheduled to start. Please try again later.');
        await this.$router.push({name: DASHBOARD_PAGE});
        return;
      }
      if (dashboardData.upcomingGames.length > 0) {
        this.scheduledGameTime = dashboardData.upcomingGames[0].time;
      }
      try {
        // all dashboard checks passed, try to join the Colyseus Lobby
        const room = await this.$client.joinOrCreate(LOBBY_NAME);
        applyWaitingServerResponses(room, this);
        this.lobbyAPI.connect(room);
      } catch (e) {
        let errorMessage = "Please complete all onboarding items on your dashboard before joining a game.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        console.log("Unable to join game, need to complete onboarding items", e);
        dashboardAPI.message(errorMessage, 'warning');
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
