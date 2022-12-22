<template>
  <b-container fluid class="h-100">
    <b-row
      align-v="stretch"
      align-h="center"
      class="h-100 w-100 m-0 p-0 text-center"
      style="background-color: var(--dark-shade-75)"
    >
      <b-col align-self="center">
        <h4>Launch Time</h4>
        <h2 class="mt-2 mb-5"><b-badge variant="success">{{ scheduledGameTimeString }}</b-badge></h2>
        <h4>Lobby Closes In</h4>
        <Countdown :nextLaunch="lobbyCloseTime" class="mb-5"></Countdown>
        <b-alert show variant="info" class="w-50 mx-auto">
          You'll join a game as soon as there are enough players to form a full group of 5.
          <hr class="my-2">
          When the lobby closes or enough time passes, any players still in the lobby will
          join a game with bots filling in the remaining spots.
        </b-alert>
      </b-col>
      <div class="w-100"></div>
      <b-col>
        <b-spinner small type="grow" label="Loading..."></b-spinner>
        <b-spinner small class="mx-2" type="grow" label="Loading..."></b-spinner>
        <b-spinner small type="grow" label="Loading..."></b-spinner>
        <h1 class="my-4">
          <b-badge :variant="variantStyle(waitingUserCount)">{{ waitingUserCount }} Player(s) Ready</b-badge>
        </h1>
        <b-button-group class="w-25 mt-4" vertical>
          <b-button :to="dashboard" variant="primary">
            Return to the Dashboard
          </b-button>
          <b-button v-if="isDevOrStaging" @click="distributeGroups" variant="secondary">
            Join game
          </b-button>
        </b-button-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Client } from "colyseus.js";
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import { applyWaitingServerResponses } from "@port-of-mars/client/api/lobby/response";
import { WaitingRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { isDevOrStaging } from "@port-of-mars/shared/settings";
import { LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { REGISTER_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { Role } from "@port-of-mars/shared/types";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";

@Component({
  components: {
    Countdown
  }
})
export default class Lobby extends Vue {
  @Inject() $client!: Client;
  @Prop() private role!: string;
  private lobbyAPI: WaitingRequestAPI = new WaitingRequestAPI();
  private waitingUserCount: number = 0;
  private nextAssignmentTime: number = 0;
  private scheduledGameTime: number = 0;
  message: string = "";
  private minutesOpenAfter: number = 0;

  get roles() {
    return this.$tstore.getters.roles;
  }

  get lobbyCloseTime() {
    return this.scheduledGameTime + (this.minutesOpenAfter * 60 * 1000);
  }

  get scheduledGameTimeString(): string {
    return new Date(this.scheduledGameTime).toLocaleString("en-US", { timeZoneName: "short" });
  }

  get nextAssignmentTimeString(): string {
    return new Date(this.nextAssignmentTime).toLocaleString();
  }

  get isDevOrStaging() {
    return isDevOrStaging();
  }

  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }

  async created() {
    const dashboardAPI = new DashboardAPI(this.$tstore, this.$ajax);
    const dashboardData = await dashboardAPI.getData();
    this.minutesOpenAfter = dashboardData.minutesOpenAfter;
    const playerTaskCompletion = dashboardData.playerTaskCompletion;
    // go to email verification page if player is not verified
    if (playerTaskCompletion.mustVerifyEmail) {
      await this.$router.push({ name: REGISTER_PAGE });
      return;
    }
    // go to consent page if player has not consented
    else if (playerTaskCompletion.mustConsent) {
      await this.$router.push({ name: REGISTER_PAGE });
      return;
    }
    // check if there is a game scheduled for play
    if (!dashboardData.isLobbyOpen) {
      dashboardAPI.message(
        "The lobby is currently closed. Please try again later."
      );
      await this.$router.push({ name: DASHBOARD_PAGE });
      return;
    }
    if (dashboardData.schedule.length > 0) {
      this.scheduledGameTime = dashboardData.schedule[0];
    }
    try {
      // all dashboard checks passed, try to join the Colyseus Lobby
      const room = await this.$client.joinOrCreate(LOBBY_NAME);
      applyWaitingServerResponses(room, this);
      this.lobbyAPI.connect(room);
    } catch (e) {
      let errorMessage =
        "Please complete all onboarding items on your dashboard before joining a game.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.log("Unable to join game, need to complete onboarding items", e);
      dashboardAPI.message(errorMessage, "warning");
      await this.$router.push({ name: DASHBOARD_PAGE });
    }
  }

  async destroyed() {
    this.lobbyAPI.leave();
  }

  playerRoleImage(role: Role): any {
    return require(`@port-of-mars/client/assets/characters/${role}.png`);
  }

  frameColor(role: Role): object {
    return { backgroundColor: `var(--color-${role})` };
  }

  borderStyle(role: Role) {
    return { border: `0.125rem solid var(--color-${role})` };
  }

  private distributeGroups() {
    this.lobbyAPI.distributeGroups();
  }

  private variantStyle(ready: number): string {
    return (ready < 4) ? "warning" : "success";
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Lobby.scss";
</style>
