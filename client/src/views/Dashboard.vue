<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-brand :to="dashboard">
          <b-img
            v-bind="portOfMarsLogoProps"
            :src="require(`@port-of-mars/client/assets/background/logo.png`)"
            alt="Port of Mars"
            >
          </b-img>
        </b-navbar-brand>
        <h2 class="mx-auto">Mission Control Dashboard</h2>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :href="contactUrl">Contact Us</b-nav-item>
          <b-nav-item @click="logout">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid style="background-color: var(--dark-shade-75)">
      <b-row class="m-0 p-0">
        <Messages></Messages>
        <b-col align-self="center" cols="9">
        <template
          v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.canPlayGame"
        >
          <p class="lead">
            Welcome to the Port of Mars! Please be sure to complete all onboarding tasks
            before embarking on your next mission.
          </p>
          <b-row>
            <b-col align-self="start" cols="auto">
              <b-button
                :disabled="!playerTaskCompletion.mustTakeIntroSurvey"
                target="_blank"
                :href="introSurveyUrl"
                :variant="playerTaskCompletion.mustTakeIntroSurvey ? 'warning' : 'secondary'"
                size="lg"
              >
                <h4>
                  Take Intro Survey
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
              <!-- Join waiting lobby -->
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
          <h1 class="mt-5 py-2">
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
          </h1>
          <p>
            We will email you with further instructions if you are eligible to 
            participate in the next round. You can review your past games in the
            <code>Previous Games</code> tab.
          </p>
          <template v-if="playerTaskCompletion.shouldTakeExitSurvey">
            <b-button :href="exitSurveyUrl" size="lg" squared variant="success">
              Take Exit Survey
            </b-button>
          </template>
        </template>
      </b-col>
      <!-- splash image + missions completed -->
      <b-col class="mt-2" align-self="end" cols="3">
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
    </b-row>
    <b-row no-gutters>
      <!-- main content area -->
      <b-col>
        <b-tabs pills class="p-3">
          <b-tab class="mt-3">
            <template #title>
              <h4>Tutorial</h4>
            </template>
            <p class="m-3 lead">
              Learn how to play Port of Mars by watching this brief tutorial video.
            </p>
            <div class="w-75 mx-auto p-3">
              <b-embed type="iframe" aspect="21by9" :src="tutorialVideoUrl" allowfullscreen>
              </b-embed>
            </div>
          </b-tab>
          <b-tab class="history mt-3">
            <template #title>
              <h4>Schedule</h4>
            </template>
            <div class="m-3 lead">
              Please sign in during <b>one</b> of the following times to participate. We
              recommend that you show up 5 minutes earlier to join the waiting lobby.
            </div>
            <div style="overflow-y: auto !important">
              <b-table :items="schedule" bordered stacked="md" small dark striped show-empty>
                <template #empty="scope">
                  <b-alert class="mt-3" variant="info" show
                    >No games have been scheduled. Please check again later!</b-alert
                  >
                </template>
                <template v-slot:cell(addToCalendar)="data">
                  <a :href="inviteLink(data.item.addToCalendar)" target="_blank">
                    <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
                  </a>
                </template>
              </b-table>
            </div>
          </b-tab>
          <b-tab class="history mt-3">
            <template #title>
              <h4>Previous Games</h4>
            </template>
            <div class="p-3 m-3 scrolling-wrapper">
              <p v-if="previousGames.length === 0" class="my-5 py-5">No games to display.</p>
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
    </b-container>
    <Footer></Footer>
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
  TUTORIAL_PAGE,
  DASHBOARD_PAGE
} from "@port-of-mars/shared/routes";

import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import PlayerStatItem from "@port-of-mars/client/components/dashboard/PlayerStatItem.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import _ from "lodash";

library.add(faGoogle, faInfoCircle);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    PlayerStatItem,
    Messages,
    Footer
  }
})
export default class Dashboard extends Vue {
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

  portOfMarsLogoProps = {
    blankColor: "#bbb",
    height: 50,
  };

  contactUrl = "mailto:portmars@asu.edu";
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

<style lang="scss" scoped>
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
  border-top: 0.1rem solid var(--light-shade-25);
}

.tabs {
  text-align: left;
  margin-top: 2em;
  overflow: none;
  background-color: var(--dark-shade);
  border: 0.2rem solid var(--light-shade-25);
  border-radius: 3px;
}

.history {
  height: 32rem;
}
</style>
