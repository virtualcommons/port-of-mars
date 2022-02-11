<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop">
    <b-row no-gutters class="h-100 w-100 justify-content-start">
      <!-- messages -->
      <section id="message-wrapper" class="d-flex flex-shrink-1 h-auto w-100 m-0">
        <b-row class="w-100 mx-2" align-v="center" align-h="center">
          <b-col sm="12" md="6" offset-md="3" class="text-center">
            <Messages></Messages>
          </b-col>
        </b-row>
      </section>

      <!-- onboarding tasks -->
      <section id="onboarding-wrapper" class="d-flex flex-shrink-1 h-auto w-100 text-center m-0 p-0">
        <!-- tasks to complete -->
        <b-row class="w-100 mx-2">
          <b-col sm="12" align-self="start">
            <template
              v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.canPlayGame"
            >
              <b-col>
                <h2>Round {{ currentRoundNumber }}: Complete onboarding tasks</h2>
              </b-col>
              <div class="w-100 mb-2"></div>
              <b-col align-self="start" cols="auto">
                <b-button
                  @click="activateTutorial"
                  :variant="hasWatchedTutorial ? 'success' : 'primary'"
                  size="lg"
                >
                  <h4>
                    <b-icon-exclamation-triangle
                      scale="1"
                      v-if="!hasWatchedTutorial"
                    ></b-icon-exclamation-triangle>
                    Watch Tutorial
                    <b-icon-check-circle-fill scale="1" v-if="hasWatchedTutorial">
                    </b-icon-check-circle-fill>
                  </h4>
                </b-button>
                <b-icon-arrow-right-circle-fill
                  scale="2"
                  class="mx-4"
                ></b-icon-arrow-right-circle-fill>
                <template v-if="playerTaskCompletion.mustTakeIntroSurvey">
                  <b-button target="_blank" :href="introSurveyUrl" variant="primary" size="lg">
                    <h4>
                      <b-icon-exclamation-triangle scale="1"></b-icon-exclamation-triangle> Take
                      Survey
                    </h4>
                  </b-button>
                </template>
                <template v-else>
                  <b-button variant="success" size="lg">
                    <h4>
                      Survey Completed
                      <b-icon-check-circle-fill scale="1"> </b-icon-check-circle-fill>
                    </h4>
                  </b-button>
                </template>

                <b-icon-arrow-right-circle-fill
                  scale="2"
                  class="mx-4"
                ></b-icon-arrow-right-circle-fill>
                <!-- Join waiting lobby -->
                <template v-if="isLobbyOpen">
                  <b-button
                    :disabled="!playerTaskCompletion.canPlayGame"
                    :to="lobby"
                    size="lg"
                    variant="warning"
                  >
                    <h4>
                      Join Game Lobby
                      <font-awesome-icon
                        :icon="['fas', 'rocket']"
                        class="my-auto mx-2"
                      ></font-awesome-icon>
                    </h4>
                  </b-button>
                </template>
                <template v-else>
                  <b-button @click="activateTab(1)" size="lg" variant="secondary">
                    <h4>Check Schedule for Next Launch</h4>
                  </b-button>
                </template>
              </b-col>
            </template>

            <!-- invite + participation status -->
            <template v-else-if="!playerTaskCompletion.hasInvite">
              <b-col>
                <h1 class="mt-3 py-2">
                  Invitation not found
                </h1>
              </b-col>
              <div class="w-100 mb-2"></div>
              <b-col>
                <p class="lead">
                  Thanks for your interest in the Port of Mars! Unfortunately you do not appear to
                  have an invitation to participate in this round of the Port of Mars. If you think
                  this is an error, please
                  <a href="mailto:portmars@asu.edu">contact us at portmars@asu.edu</a>.
                </p>
              </b-col>
            </template>

            <!-- exit survey -->
            <template v-else>
              <b-col><h1>Thank you for participating!</h1></b-col>
              <div class="w-100 mb-2"></div>
              <b-col v-if="playerTaskCompletion.shouldTakeExitSurvey">
                <b-button :href="exitSurveyUrl" size="lg" squared variant="primary">
                  Take Exit Survey
                </b-button>
              </b-col>
              <b-col v-else>
                <p>
                  We will email you with further instructions if you are eligible to participate in
                  the next round. You can review your past games in the
                  <code>Previous Games</code> tab.
                </p>
              </b-col>
            </template>
          </b-col>
        </b-row>
      </section>

      <!-- game info -->
      <section id="game-info-wrapper" class="d-flex flex-grow-1 w-100 h-50 m-0 p-0">
        <!-- tutorial, schedule, previous games -->
        <b-row class="h-100 w-100 mx-2">
          <b-col sm="12" md="8" offset-md="2">
            <b-tabs pills class="h-100 w-100 p-4 my-2 mx-auto" v-model="tabIndex">
              <!-- tutorial -->
              <b-tab class="h-100 w-100 mt-3">
                <template #title>
                  <h4>Tutorial</h4>
                </template>
                <h4 class="text-center">
                  Learn to play Port of Mars with this brief tutorial video.
                </h4>
                <div class="m-auto w-50">
                  <b-embed
                    id="tutorialVideo"
                    type="iframe"
                    aspect="16by9"
                    :src="tutorialVideoUrl"
                    allowfullscreens
                    class="p-3"
                  >
                  </b-embed>
                </div>
              </b-tab>

              <!-- schedule -->
              <b-tab class="h-100 w-100 mt-3 p-2">
                <template #title>
                  <h4>Schedule</h4>
                </template>
                <p class="m-3 lead">
                  <ul>
                    <li>You can only <mark>participate in one game</mark> this round</li>
                    <li>Sign in and join the game lobby when a game is scheduled</li>
                    <li>
                      The game lobby
                      <mark
                        >opens 10 minutes before launch time and stays open for 30 minutes after
                        launch time</mark
                      >
                    </li>
                  </ul>
                </p>
                <p class="text-center">
                  <Schedule :schedule="schedule" :roundNumber="currentRoundNumber"></Schedule>
                </p>
              </b-tab>

              <!-- previous games -->
              <b-tab class="h-100 w-100 mt-3 p-2">
                <template #title>
                  <h4>Previous Games</h4>
                </template>
                <h4 v-if="previousGames.length === 0" class="text-center">
                  No games to display
                </h4>
                <div v-else class="scrollable backdrop" id="stats-container">
                  <div v-for="playerStatItem in previousGames" :key="playerStatItem.time">
                    <PlayerStatItem :playerStatItem="playerStatItem" class="my-3 p-3">
                    </PlayerStatItem>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </section>

    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRocket, faInfoCircle, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Player from "@vimeo/player";

import { PlayerTaskCompletion, Stats } from "@port-of-mars/shared/types";
import {
  REGISTER_PAGE,
  LOBBY_PAGE,
  SIGNEDUP_PAGE,
  TUTORIAL_PAGE,
  DASHBOARD_PAGE
} from "@port-of-mars/shared/routes";

import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import PlayerStatItem from "@port-of-mars/client/components/dashboard/PlayerStatItem.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import Header from "@port-of-mars/client/components/global/Header.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import Schedule from "@port-of-mars/client/components/dashboard/Schedule.vue";
import _ from "lodash";

library.add(faGoogle, faInfoCircle, faRocket, faCalendarPlus);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    Footer,
    Header,
    Messages,
    PlayerStatItem,
    Schedule
  }
})
export default class Dashboard extends Vue {
  api!: DashboardAPI;
  tabIndex = 0;
  loading = true;
  introSurveyUrl: string = "";
  exitSurveyUrl: string = "";
  currentRoundNumber: number = 1;
  schedule: Array<number> = [];
  isLobbyOpen = false;
  hasWatchedTutorial = false;
  playerTaskCompletion: PlayerTaskCompletion = {
    mustConsent: true,
    mustVerifyEmail: true,
    mustTakeTutorial: true,
    mustTakeIntroSurvey: true,
    canPlayGame: false,
    shouldTakeExitSurvey: false,
    hasInvite: false
  };
  stats: Stats = { games: [] };

  tutorialVideoUrl = "https://player.vimeo.com/video/642036661";

  get gamesPlayedCount() {
    return this.stats.games.length;
  }

  get previousGames() {
    return _.orderBy(this.stats.games, ["time"], ["desc"]);
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

  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }

  async created() {
    this.api = new DashboardAPI(this.$tstore, this.$ajax);
    await this.initialize();
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

    /*
    // go to tutorial if player has not taken tutorial
    else if (data.playerTaskCompletion.mustTakeTutorial) {
      // FIXME: open tutorial video fullscreen once we get vimeo player integration set up
      await this.$router.push({ name: TUTORIAL_PAGE });
    }
    */

    // set survey URLs
    Vue.set(this, "introSurveyUrl", data.introSurveyUrl);
    Vue.set(this, "exitSurveyUrl", data.exitSurveyUrl);
    Vue.set(this, "isLobbyOpen", data.isLobbyOpen);
    Vue.set(this, "currentRoundNumber", data.currentRoundNumber);
    Vue.set(this, "schedule", data.schedule);

    // set player stats
    this.stats.games.splice(0, this.stats.games.length, ...data.stats.games);
    console.log("setting upcoming games for schedule: ", data.schedule);
    this.loading = false;
  }

  activateTutorial() {
    const iframe = document.getElementById(
      "tutorialVideo"
    ) as HTMLIFrameElement;
    const player = new Player(iframe);
    // FIXME: currently some typescript bugs with the vimeo player ts defs
    (player as any).requestFullscreen().then(() => player.play());
    (player as any).on("ended", (data: any) => {
      console.log("Video ended");
      this.hasWatchedTutorial = true;
      // FIXME: submit to a new API endpoint also and read it in from dashboard data
    });
  }
}
</script>

<style lang="scss">
#dashboard-bg {
  background: url("../assets/images/bg-moon.png");
  background-position: center;
}
::-webkit-scrollbar {
  width: 0;
}

.tab-content {
  border-top: 0.1rem solid $light-shade-25;
}

.tabs {
  text-align: left;
  margin-top: 2em;
  overflow: none;
  background-color: $dark-shade-75;
  border: 0.2rem solid $light-shade-25;
  border-radius: 3px;
}

#message-wrapper {
  padding: 150px 0 0 0;
}

#stats-container {
  width: 90%;
  height: 75%;
}
</style>
