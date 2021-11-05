<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row class="h-auto m-0 p-0">
      <Header></Header>
    </b-row>
    <b-row class="d-flex flex-grow-1 m-2">
      <Messages></Messages>
      <b-col align-self="center" cols="9">
        <template
          v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.canPlayGame"
        >
          <p class="text-dark lead">
            Welcome to the Port of Mars! Please be sure to complete all onboarding tasks
            before embarking on your next mission. If this is your first time we highly encourage
            you to <a class='text-primary' @click="activateTutorial">watch the tutorial video</a>.
            <br>
            After watching the tutorial and completing the introductory survey, click on the Schedule tab below 
            to see when games are available.
          </p>
          <b-row>
            <b-col align-self="start" cols="auto">
              <b-button @click="activateTutorial" variant="primary" size="lg">
                <h4>Watch Tutorial</h4>
              </b-button>
              <b-icon-arrow-right-circle-fill
                scale="2"
                class="mx-4"
              ></b-icon-arrow-right-circle-fill>
              <b-button
                :disabled="!playerTaskCompletion.mustTakeIntroSurvey"
                target="_blank"
                :href="introSurveyUrl"
                variant="primary"
                size="lg"
              >
                <h4>
                  Take Survey
                  <b-icon-check-circle-fill
                    v-if="!playerTaskCompletion.mustTakeIntroSurvey"
                    variant="success"
                    scale="1"
                    class="ml-2"
                  ></b-icon-check-circle-fill>
                </h4>
              </b-button>
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
                  variant="success"
                >
                  <h4>
                    <font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon>
                  Join Game Lobby</h4>
                </b-button>
              </template>
              <template v-else>
                <b-button @click="activateTab(1)" size="lg" variant="secondary">
                  <h4>Check Schedule for Next Launch</h4>
                </b-button>
              </template>
            </b-col>
          </b-row>
        </template>
        <!-- invite + participation status -->
        <template v-else-if="!playerTaskCompletion.hasInvite">
          <h1 class="mt-3 py-2">
            Invitation not found
          </h1>
          <p class="lead">
            Thanks for your interest in the Port of Mars! Unfortunately you do not appear to
            have an invitation to participate in this round of the Port of Mars. If you think
            this is an error, please <a href="mailto:portmars@asu.edu">contact us at
            portmars@asu.edu</a>.
          </p>
        </template>
        <template v-else>
          <h1>
            Thank you for participating!
            <template v-if="playerTaskCompletion.shouldTakeExitSurvey">
              <b-button :href="exitSurveyUrl" size="lg" squared variant="success">
                Take Exit Survey
              </b-button>
            </template>
          </h1>
          <p>
            We will email you with further instructions if you are eligible to 
            participate in the next round. You can review your past games in the
            <code>Previous Games</code> tab.
          </p>
        </template>
      </b-col>
    <!-- splash image + missions completed -->
      <b-col class="mt-2 align-content-end" align-self="end" cols="3">
        <b-img
          :src="require(`@port-of-mars/client/assets/characters/Politician.png`)"
          alt="player"
        >
        </b-img>
        <p>
          You have participated in
          <b-badge variant="primary">{{ gamesPlayedCount }}</b-badge> missions.
        </p>
      </b-col>
      <div class="w-100"></div>
      <b-col>
        <b-tabs pills class="p-3" v-model="tabIndex" small>
          <b-tab class="mt-3">
            <template #title>
              <h4>Tutorial</h4>
            </template>
            <p class="m-3 lead">
              Learn how to play Port of Mars by watching this brief tutorial video.
            </p>
            <div class="mx-auto w-50">
              <b-embed id="tutorialVideo" type="iframe" aspect="16by9" :src="tutorialVideoUrl" allowfullscreen>
              </b-embed>
            </div>
          </b-tab>
          <b-tab class="mt-3">
            <template #title>
              <h4>Schedule</h4>
            </template>
            <p class="m-3 lead">
              Please sign in during <b>one</b> of the following times to participate. We
              recommend that you show up 5 minutes earlier to join the waiting lobby.
            </p>
            <div style="overflow-y: auto !important">
              <b-table :items="schedule" stacked="md" bordered show-empty>
                <template #empty="scope">
                  <b-alert class="mt-2 lead" variant="info" show>
                    No upcoming games on the schedule at this time. Please check again later!
                  </b-alert>
                </template>
                <template v-slot:cell(addToCalendar)="data">
                  <a :href="inviteLink(data.item.addToCalendar)" target="_blank">
                    <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
                  </a>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab class="mt-3">
            <template #title>
              <h4>Previous Games</h4>
            </template>
            <p v-if="previousGames.length === 0" class='m-3 lead'>
              No games to display.
            </p>
            <div class="p-3 m-3 scrolling-wrapper">
              <PlayerStatItem
                v-for="playerStatItem in previousGames"
                :key="playerStatItem.time"
                :playerStatItem="playerStatItem"
                class="my-1 py-1"
              >
              </PlayerStatItem>
            </div>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
    <b-row align-v="end" class="h-auto w-100 m-0 p-0">
      <Footer></Footer>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faRocket, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Player from "@vimeo/player";
import { CalendarEvent, google } from "calendar-link";

import { GameMeta, PlayerTaskCompletion, Stats } from "@port-of-mars/shared/types";
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
import _ from "lodash";

library.add(faGoogle, faInfoCircle, faRocket);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    Header,
    PlayerStatItem,
    Messages,
    Footer
  }
})
export default class Dashboard extends Vue {
  api!: DashboardAPI;
  tabIndex = 0;
  loading = true;
  upcomingGames: Array<GameMeta> = [];
  introSurveyUrl: string = "";
  exitSurveyUrl: string = "";
  currentRoundNumber: number = 1;
  isLobbyOpen = false;
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

  tutorialVideoUrl = "https://player.vimeo.com/video/642036661?h=2295c303de&autoplay=1&autopause=1";

  get username() {
    console.log("user? ", this.$tstore.state.user);
    return this.$tstore.state.user.username;
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

  get tutorial() {
    return { name: TUTORIAL_PAGE };
  }

  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }

  async created() {
    this.api = new DashboardAPI(this.$tstore, this.$ajax);
    await this.initialize();
    console.log("user: ", this.$tstore.state.user);
  }

  inviteLink(invite: { title: string; location: string; start: Date; end: Date; details: string }) {
    return google(invite);
  }

  async initialize() {
    // get player task completion status
    const data = await this.api.getData();
    console.log("incoming dashboard data: ", data);
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
      await this.$router.push({ name: TUTORIAL_PAGE });
    }
    */

    // set survey URLs
    this.$set(this, "introSurveyUrl", data.introSurveyUrl);
    this.$set(this, "exitSurveyUrl", data.exitSurveyUrl);
    this.$set(this, "currentRoundNumber", data.currentRoundNumber);
    console.log("is lobby open? ", data.isLobbyOpen);
    this.$set(this, "isLobbyOpen", data.isLobbyOpen);

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

  activateTab(index: number) {
    this.tabIndex = index;
  }

  activateTutorial() {
    this.activateTab(0);
    const iframe = document.getElementById("tutorialVideo") as HTMLIFrameElement;
    const player = new Player(iframe);
    // FIXME: currently some typescript bugs with the vimeo player ts defs
    (player as any).requestFullscreen().then(() => player.play());
  }

}
</script>

<style lang="scss" scoped>

.dark-bg {
  background-color: $dark-shade-75;
}

.scrolling-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 32rem;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
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

</style>
