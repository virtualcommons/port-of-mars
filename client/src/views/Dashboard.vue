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
                    Your mission is to stay alive and achieve the most Victory Points.
                    In each round you will usually receive 10 time blocks that you can invest in System Health
                    or Influence resources. System Health keeps your team alive.
                    Influence resources are used to purchase Accomplishments that earn you Victory Points.
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
                      :src="constants.TUTORIAL_VIDEO_URL"
                      allowfullscreens
                      class="py-3"
                    ></b-embed>
                  </div>
                </b-col>
                <b-col sm="12" md="6" class="text-center d-flex flex-column align-items-center" align-self="center">
                  <b-alert v-if="isBanned" show variant="danger" class="w-75 mb-5 text-left">
                    <h4 class="alert-heading">Warning</h4>
                    <p>
                      Your account has been permanantly disabled in response to multiple or egregious violations of the
                      <a href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct" class="alert-link">
                        Code of Conduct</a>. You will not be able to partipate in any future games.
                    </p>
                    <hr class="my-2">
                    <p class="mb-0">
                      If you believe this was done in error, please <a href="mailto:portmars@asu.edu" class="alert-link">let us know</a>.
                    </p>
                  </b-alert>
                  <b-alert v-else-if="isMuted" show variant="warning" class="w-75 mb-5 text-left">
                    <h4 class="alert-heading">Warning</h4>
                    <p>
                      You have been muted for 3 days in response to a violation of the
                      <a href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct" class="alert-link">
                        Code of Conduct</a>. You will not be able to send chat messages in game.
                    </p>
                    <hr class="my-2">
                    <p class="mb-0">
                      If you believe this was done in error, please <a href="mailto:portmars@asu.edu" class="alert-link">let us know</a>.
                    </p>
                  </b-alert>
                  <h4>Next Launch In</h4>
                  <Countdown v-if="nextScheduledLaunch" :nextLaunch="nextScheduledLaunch" class="mb-5"></Countdown>
                  <p v-else>No games scheduled</p>
                  <b-button
                    :disabled="!isLobbyOpen || isBanned"
                    :to="lobby"
                    size="lg"
                    variant="warning"
                  >
                    <h4>
                      Join Game Lobby
                    </h4>
                  </b-button>
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <b-tab title="Launch Schedule" class="h-100 w-100 ">
            <Schedule :schedule="schedule"></Schedule>
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
import { Constants } from "@port-of-mars/shared/settings";
import { PlayerTaskCompletion, Stats } from "@port-of-mars/shared/types";
import {
  REGISTER_PAGE,
  LOBBY_PAGE,
  DASHBOARD_PAGE,
  MANUAL_PAGE,
} from "@port-of-mars/shared/routes";

import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import PlayerStatItem from "@port-of-mars/client/components/dashboard/PlayerStatItem.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import Schedule from "@port-of-mars/client/components/dashboard/Schedule.vue";
import _ from "lodash";

@Component({
  components: {
    Footer,
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
  pollingIntervalId = 0;
  isLobbyOpen = false;
  isBanned = false;
  isMuted = false;
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

  get constants() {
    return Constants;
  }

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
    if (this.pollingIntervalId != 0) {
      clearInterval(this.pollingIntervalId);
    }
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
    // set additional data
    Vue.set(this, "introSurveyUrl", data.introSurveyUrl);
    Vue.set(this, "exitSurveyUrl", data.exitSurveyUrl);
    Vue.set(this, "isLobbyOpen", data.isLobbyOpen);
    Vue.set(this, "isMuted", data.user.isMuted);
    Vue.set(this, "isBanned", data.user.isBanned);
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
    this.pollingIntervalId = window.setInterval(async () => {
      const isLobbyOpen = await this.api.isLobbyOpen();
      console.log("lobby status: ", isLobbyOpen);
      Vue.set(this, "isLobbyOpen", isLobbyOpen);
    }, 60 * 1000);
  }

  activateTutorial() {
    console.log("needs implementation");
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
}

#message-wrapper {
  padding: 0 0 0 0;
}

#stats-container {
  width: 90%;
  height: 75%;
}
</style>