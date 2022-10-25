<template>
  <b-container fluid class="h-100 m-0 p-0 backdrop overflow-auto">
    <Messages class="position-fixed p-3"></Messages>
    <b-row no-gutters class="h-100 w-100 p-5">
      <b-col>
        <b-tabs pills class="h-100 w-100 p-4 my-2 mx-auto content-container">
          <b-tab title="Dashboard" class="h-100 w-100 mt-3">
            <b-container fluid class="h-100">
              <b-row class="justify-content-center">
                <b-col sm="12" md="6">
                  <h4>The Objective</h4>
                  <p>
                    Your mission is to stay alive and achieve the most victory points.
                    Each round you receive 10 time blocks that you can invest in system health
                    or accomplishments. System health will maintain the shared infrastructure 
                    (upkeep) and keep the team alive. Accomplishments will earn you victory points.
                  </p>
                  <h4>Manual</h4>
                  <p>
                    For a quick reference, check out the <router-link :to="manual">game manual</router-link>
                  </p>
                  <h4>Tutorial</h4>
                  <div id="tutorial-wrapper">
                    <b-embed
                      id="tutorialVideo"
                      type="iframe"
                      aspect="16by9"
                      :src="tutorialVideoUrl"
                      allowfullscreens
                      class="py-3"
                    ></b-embed>
                  </div>
                </b-col>
                <b-col sm="12" md="6" class="text-center" align-self="center">
                  <h4>Next Launch In</h4>
                  <Countdown v-if="nextScheduledLaunch" :nextLaunch="nextScheduledLaunch" class="mb-5"></Countdown>
                  <p v-else>No games scheduled</p>
                  <b-button
                    :disabled="!isLobbyOpen"
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
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <b-tab title="Launch Schedule" class="h-100 w-100 ">
            <Schedule :schedule="schedule" :roundNumber="currentRoundNumber"></Schedule>
          </b-tab>
          <b-tab title="Statistics" class="h-100 w-100 ">
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
  DASHBOARD_PAGE,
  MANUAL_PAGE,
} from "@port-of-mars/shared/routes";

import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import PlayerStatItem from "@port-of-mars/client/components/dashboard/PlayerStatItem.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
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
    Countdown,
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
  polling: number = null;
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

  get manual() {
    return { name: MANUAL_PAGE };
  }

  get nextScheduledLaunch() {
    return this.schedule[0];
  }

  async created() {
    this.api = new DashboardAPI(this.$tstore, this.$ajax);
    await this.initialize();
  }

  beforeDestroy() {
    clearInterval(this.polling);
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

    // poll server for lobby open status
    this.pollLobbyStatus();
  }

  async pollLobbyStatus() {
    this.polling = setInterval(async () => {
      const isLobbyOpen = await this.api.isLobbyOpen();
      console.log("lobby status: ", isLobbyOpen);
      Vue.set(this, "isLobbyOpen", isLobbyOpen);
    }, 60 * 1000);
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

.overflow-auto {
  overflow: auto;
}

::-webkit-scrollbar {
  width: 0;
}

.tab-content {
  height: 100%;
  border-top: 0.1rem solid $light-shade-25;
}

.tabs {
  text-align: left;
  overflow: none;
}

#tutorial-wrapper {
  max-width: 600px;
  margin-left: -25px;
}

#message-wrapper {
  padding: 0 0 0 0;
}

#stats-container {
  width: 90%;
  height: 75%;
}
</style>
