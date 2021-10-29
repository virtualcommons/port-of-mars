<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row
      align-v="stretch"
      class="h-100 w-100 m-0 p-0"
      style="background-color: var(--dark-shade-75)"
    >
      <!-- profile info -->
      <b-col class="h-100" cols="3" style="background-color: var(--dark-shade)">
        <b-row>
          <b-img
            v-bind="mainProps"
            style="opacity: 50%"
            :src="require(`@port-of-mars/client/assets/background/logo.png`)"
            alt="Port of Mars"
            left
            class="m-4"
          ></b-img>
        </b-row>
        <b-row class="my-5 mx-1 py-3" style="background-color: var(--dark-accent)">
          <b-col align-self="center" cols="5">
            <b-img
              fluid-grow
              center
              :src="require(`@port-of-mars/client/assets/characters/Politician.png`)"
              alt="player"
            >
            </b-img>
          </b-col>
          <b-col align-self="center" cols="7">
            <h3 class="dark">{{ username }}</h3>
            <p class="dark">
              You have participated in
              <b-badge variant="primary">{{ gamesPlayedCount }}</b-badge> missions.
            </p>
          </b-col>
        </b-row>

        <b-nav vertical pills class="text-left">
          <b-nav-item active><h4>Dashboard</h4></b-nav-item>
          <b-nav-item :to="tutorial"><h4>Tutorial</h4></b-nav-item>
          <b-nav-item :to="register"><h4>Modify Consent and Email</h4></b-nav-item>
          <b-nav-item @click="logout"><h4>Logout</h4></b-nav-item>
        </b-nav>
      </b-col>
      <b-col class="h-100" cols="9" style="background-color: var(--dark-shade-75)">
        <b-row class="h-100">
          <b-col class="h-25 w-100">
            <Messages></Messages>
            <template
              v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.canPlayGame"
            >
              <b-row align-v="center" class="w-100 h-100">
                <b-col cols="auto">
                  <h1 style="font-weight: medium">
                    Mission Control Onboarding
                  </h1>
                  <p>
                    Welcome to the Port of Mars! Please be sure to complete all onboarding tasks
                    before embarking on your next mission.
                  </p>
                </b-col>
                <div class="w-100"></div>
                <b-col align-self="start" cols="auto">
                  <b-button
                    :disabled="!playerTaskCompletion.mustTakeTutorial"
                    :to="tutorial"
                    :variant="playerTaskCompletion.mustTakeTutorial ? 'warning' : 'secondary'"
                    size="lg"
                  >
                    <h4>
                      Tutorial
                      <b-icon-check-circle-fill
                        v-if="!playerTaskCompletion.mustTakeTutorial"
                        scale="1"
                        class="ml-2"
                      >
                      </b-icon-check-circle-fill>
                    </h4>
                  </b-button>
                  <b-icon-arrow-right-circle-fill
                    scale="2"
                    class="mx-4"
                  ></b-icon-arrow-right-circle-fill>
                  <b-button
                    :disabled="!playerTaskCompletion.mustTakeIntroSurvey"
                    target="_blank"
                    :href="introSurveyUrl"
                    :variant="playerTaskCompletion.mustTakeIntroSurvey ? 'warning' : 'secondary'"
                    size="lg"
                  >
                    <h4>
                      Intro Survey
                      <b-icon-check-circle-fill
                        v-if="!playerTaskCompletion.mustTakeIntroSurvey"
                        scale="1"
                        class="ml-2"
                      ></b-icon-check-circle-fill>
                    </h4>
                  </b-button>

                  <b-icon-arrow-right-circle-fill
                    scale="2"
                    class="mx-4"
                  ></b-icon-arrow-right-circle-fill>

                  <!-- go to waiting lobby -->

                  <b-button
                    :disabled="!playerTaskCompletion.canPlayGame"
                    :to="lobby"
                    size="lg"
                    variant="success"
                  >
                    <h4>Join Game Lobby</h4>
                  </b-button>
                </b-col>
              </b-row>
            </template>

            <!-- invite + participation status -->
            <template v-else-if="!playerTaskCompletion.hasInvite">
              <h1 class="text-left mt-5 py-2" style="font-weight: medium">
                No active invitation found
              </h1>
              <p class="text-left">
                Thanks for your interest in the Port of Mars! Unfortunately you do not appear to
                have an invitation to participate in this round of the Port of Mars. If you think
                this is an error, please contact us at
                <a href="mailto:portmars@asu.edu">portmars@asu.edu</a>.
              </p>
            </template>

            <template v-else-if="playerTaskCompletion.shouldTakeExitSurvey">
              <h1 class="text-left mt-5 py-2" style="font-weight: medium">
                Thank you for participating in the Port of Mars.
              </h1>
              <b-button :href="exitSurveyUrl" size="lg" squared variant="success">
                Take Exit Survey
              </b-button>
            </template>
            <template v-else>
              <h1 class="mt-5 py-2" style="font-weight: medium">
                Thanks for participating in the Port of Mars.
              </h1>
              <p>
                We will email you with further instructions if you are eligible to participate in
                the next round. You can review your past games by clicking
                <code>Previous Games</code>.
              </p>
            </template>
          </b-col>
          <div class="w-100"></div>
          <b-col class="h-75">
            <b-tabs pills>
              <b-tab class="mt-3">
                <template #title>
                  <h4>Schedule</h4>
                </template>
                <div
                  class="tabs"
                  style="background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
                >
                  <template>
                    <p class="m-5">
                      Please sign in during <b>one</b> of the following times to participate. We
                      recommend that you show up 5 minutes earlier to join the waiting lobby.
                    </p>
                    <div style="overflow-y: auto !important">
                      <b-table
                        :items="schedule"
                        bordered
                        class="py-3"
                        stacked="md"
                        small
                        dark
                        striped
                      >
                        <template v-slot:cell(addToCalendar)="data">
                          <a :href="inviteLink(data.item.addToCalendar)" target="_blank">
                            <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
                          </a>
                        </template>
                      </b-table>
                    </div>
                  </template>
                </div>
              </b-tab>
              <b-tab class="mt-3">
                <template #title>
                  <h4>Previous Games</h4>
                </template>
                <div
                  class="tabs"
                  style="background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
                >
                  <template style="background-color: var(--dark-shade)">
                    <div class="p-5 m-3 scrolling-wrapper">
                      <p v-if="stats.games.length === 0" class="my-5 py-5">No games to display.</p>
                      <PlayerStatItem
                        v-for="playerStatItem in stats.games"
                        :key="playerStatItem.time"
                        :playerStatItem="playerStatItem"
                        class="my-1 py-1"
                      ></PlayerStatItem>
                    </div>
                  </template>
                </div>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </b-col>
      <Footer class="fixed-bottom position-absolute"></Footer>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { CalendarEvent, google } from "calendar-link";

import { GameMeta, PlayerTaskCompletion, Stats } from "@port-of-mars/shared/types";
import {
  REGISTER_PAGE,
  LOBBY_PAGE,
  LOGIN_PAGE,
  SIGNEDUP_PAGE,
  TUTORIAL_PAGE
} from "@port-of-mars/shared/routes";

import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import PlayerStatItem from "@port-of-mars/client/components/dashboard/PlayerStatItem.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import ActionItem from "@port-of-mars/client/components/dashboard/ActionItem.vue";
import _ from "lodash";

library.add(faGoogle, faInfoCircle);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    ActionItem,
    PlayerStatItem,
    Messages,
    Footer
  }
})
export default class Dashboard extends Vue {
  username: string = this.$tstore.state.user.username;
  api!: DashboardAPI;
  loading = true;
  upcomingGames: Array<GameMeta> = [];
  introSurveyUrl: string = "";
  exitSurveyUrl: string = "";
  currentRoundNumber: number = 1;
  playerTaskCompletion: PlayerTaskCompletion = {
    mustConsent: true,
    mustVerifyEmail: true,
    mustTakeTutorial: true,
    mustTakeIntroSurvey: true,
    canPlayGame: false,
    shouldTakeExitSurvey: false,
    hasInvite: false
  };
  schedule: Array<{ date: string; addToCalendar: CalendarEvent }> = [
    {
      date: "",
      addToCalendar: {
        title: "",
        location: "",
        start: "",
        duration: [0, "hour"],
        description: ""
      }
    }
  ];
  stats: Stats = { games: [] };
  mainProps = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 200,
    height: 200
  };
  maxValue = 100;

  get gamesPlayedCount() {
    return this.stats.games.length;
  }

  get lobby() {
    return { name: LOBBY_PAGE };
  }

  get register() {
    return { name: REGISTER_PAGE };
  }

  get tutorial() {
    return { name: TUTORIAL_PAGE };
  }

  get progressValue() {
    if (this.playerTaskCompletion.canPlayGame) return 100;
    else if (this.playerTaskCompletion.mustTakeIntroSurvey) return 66;
    else if (this.playerTaskCompletion.mustTakeTutorial) return 50;
  }

  get progressVariant() {
    switch (this.progressValue) {
      case 50:
      case 66:
        return "warning";
      case 100:
        return "success";
    }
  }

  created() {
    this.api = new DashboardAPI(this.$tstore, this.$ajax);
    this.initialize();
  }

  inviteLink(invite: { title: string; location: string; start: Date; end: Date; details: string }) {
    return google(invite);
  }

  async initialize() {
    // get player task completion status
    const data = await this.api.getData();
    this.$set(this, "playerTaskCompletion", data.playerTaskCompletion);

    // go to email verification page if player is not verified
    if (data.playerTaskCompletion.mustVerifyEmail) {
      await this.$router.push({ name: REGISTER_PAGE });
    }

    // go to consent page if player has not consented
    else if (data.playerTaskCompletion.mustConsent) {
      await this.$router.push({ name: REGISTER_PAGE });
    }

    // go to the signed up page if signup is enabled
    else if (data.isSignUpEnabled) {
      await this.$router.push({ name: SIGNEDUP_PAGE });
    }

    // go to tutorial if player has not taken tutorial
    else if (data.playerTaskCompletion.mustTakeTutorial) {
      await this.$router.push({ name: TUTORIAL_PAGE });
    }

    // set survey URLs
    this.$set(this, "introSurveyUrl", data.introSurveyUrl);
    this.$set(this, "exitSurveyUrl", data.exitSurveyUrl);
    this.$set(this, "currentRoundNumber", data.currentRoundNumber);

    // set player stats
    this.stats.games.splice(0, this.stats.games.length, ...data.stats.games);
    this.upcomingGames = data.upcomingGames;
    this.schedule = data.upcomingGames.map(game => {
      const scheduledDate = new Date(game.time);
      return {
        date: scheduledDate.toLocaleString(),
        addToCalendar: {
          title: `Participate in Port of Mars Experiment, Round ${game.round}`,
          location: "https://portofmars.asu.edu/",
          start: scheduledDate,
          duration: [2, "hour"],
          description: "https://portofmars.asu.edu/"
        }
      };
    });
    this.loading = false;
  }

  logout(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }
}
</script>

<style lang="scss">
.dark {
  color: var(--dark-shade);
}

.scrolling-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  height: 90%;
}

.tabs {
  text-align: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  height: 500px;
  overflow: none;
}
</style>
