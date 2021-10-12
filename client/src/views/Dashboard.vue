<template>
  <b-container fluid class="h-100 m-0 p-0">
    <Messages />
    <b-row
      class="justify-content-center  m-0 p-0 w-100 h-100"
      style="background-color: var(--dark-shade-75)"
    >
      <!-- profile info -->
      <b-col align-self="stretch" cols="3" style="background-color: var(--dark-shade)">
        <b-row>
          <b-img
            v-bind="mainProps"
            style="opacity: 50%"
            :src="require(`@port-of-mars/client/assets/background/logo.png`)"
            alt="Port of Mars"
            left
            class="m-4"
          >
          </b-img>
        </b-row>

        <b-row class="my-5 mx-1 py-3" style="background-color: var(--dark-accent)">
          <b-col cols="4">
            <b-img
              v-bind="mainProps"
              :src="require(`@port-of-mars/client/assets/characters/Politician.png`)"
              :alt="player"
            >
            </b-img>
          </b-col>
          <b-col cols="8">
            <h3 style="color: var(--dark-shade); font-weight: bold">{{ username }}</h3>
            <p style="color: var(--dark-shade)">
              You have participated in <b>{{ gamesPlayedCount }}</b> missions.
            </p>
          </b-col>
        </b-row>

        <b-nav vertical pills class="text-left">
          <b-nav-item active><h4>Dashboard</h4></b-nav-item>
          <b-nav-item to="tutorial"><h4>Tutorial</h4></b-nav-item>
          <b-nav-item to="register"><h4>Modify Consent and Email</h4></b-nav-item>
          <b-nav-item @click="logout"><h4>Logout</h4></b-nav-item>
        </b-nav>

        <b-row>
          <Footer style="position: absolute; bottom: 0"></Footer>
        </b-row>
      </b-col>
      <b-col align-self="stretch" cols="9" style="background-color: var(--dark-shade-75)">
        <b-row class="h-100 mt-3">
          <b-col align-self="stretch">
            <template
              v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.canPlayGame"
            >
              <b-row>
                <b-col cols="4">
                  <h1 class="text-left my-3" style="font-weight: medium">Onboarding Tasks</h1>
                  <p
                    v-if="
                      !playerTaskCompletion.canPlayGame || playerTaskCompletion.mustTakeIntroSurvey
                    "
                    class="text-left"
                  >
                    Complete the following items to play a game.
                  </p>
                  <p v-else class="text-left">Onboarding tasks complete. Ready to launch.</p>
                </b-col>
                <b-col class="text-left my-5">
                  <b-button
                    :disabled="!playerTaskCompletion.mustTakeTutorial"
                    to="tutorial"
                    :variant="playerTaskCompletion.mustTakeTutorial ? 'warning' : 'secondary'"
                    size="lg"
                    ><h4>
                      Tutorial
                      <b-icon-check-circle-fill
                        v-if="!playerTaskCompletion.mustTakeTutorial"
                        scale="1"
                        class="ml-2"
                      ></b-icon-check-circle-fill>
                    </h4>
                  </b-button>

                  <b-icon-arrow-right-circle-fill
                    scale="2"
                    class="mx-4"
                  ></b-icon-arrow-right-circle-fill>
                  <b-button
                    :disabled="!playerTaskCompletion.mustTakeIntroSurvey"
                    :href="introSurveyUrl"
                    size="lg"
                    :variant="playerTaskCompletion.mustTakeIntroSurvey ? 'warning' : 'secondary'"
                  >
                    <h4>
                      Introduction Survey
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
                    size="lg"
                    to="lobby"
                    variant="success"
                  >
                    <h4>Join Game Lobby</h4>
                  </b-button>
                </b-col>
              </b-row>
            </template>

            <!-- invite + participation status -->
            <template v-if="!playerTaskCompletion.hasInvite">
              <h1 class="text-left text-uppercase mt-5 py-2">No active invitation found</h1>
              <p class="text-left">
                Thanks for your interest in the Port of Mars! Unfortunately you do not appear to
                have an invitation to participate in this round of the Port of Mars. If you think
                this is an error, please contact us at
                <a href="mailto:portmars@asu.edu">portmars@asu.edu</a>.
              </p>
            </template>

            <template v-else-if="playerTaskCompletion.shouldTakeExitSurvey">
              <h1 class="text-left text-uppercase mt-5 py-2">Already Participated</h1>
              <b-button
                v-if="playerTaskCompletion.shouldTakeExitSurvey"
                :href="exitSurveyUrl"
                size="lg"
                variant="warning"
              >
                Exit Survey
              </b-button>
              <p class="text-left">
                Thanks for participating in the Port of Mars! We will email you with further
                instructions if you are eligible to participate in the next round. You can review
                your past games by clicking
                <code>Your Stats</code> in the navbar above.
              </p>
            </template>

            <!-- Navigate: Schedule or Stats -->
            <b-nav pills align="left" class="my-3">
              <b-nav-item @click="switchTab('schedule')" :active="view === 'schedule'"
                ><h4>Schedule</h4></b-nav-item
              >
              <b-nav-item @click="switchTab('stats')" :active="view === 'stats'"
                ><h4>Your Game Stats</h4></b-nav-item
              >
            </b-nav>
            <div
              class="text-center p-4"
              style="height: 75vh; background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
            >
              <!-- Schedule -->
              <template v-if="view === 'schedule'">
                <h1>Schedule</h1>
                <p>
                  Please sign in during <b>one</b> of the following times to participate. We
                  recommend that you show up 5 minutes earlier to join the waiting lobby.
                </p>
                <div style="overflow-y: auto !important">
                  <b-table :items="schedule" bordered class="py-3" stacked="md" small dark striped>
                    <template v-slot:cell(addToCalendar)="data">
                      <a :href="inviteLink(data.item.addToCalendar)" target="_blank">
                        <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
                      </a>
                    </template>
                  </b-table>
                </div>
              </template>
              <!-- Stats -->
              <template v-else-if="view === 'stats'" style="background-color: var(--dark-shade)">
                <h1>Your Game Stats</h1>
                <div
                  class="mx-auto my-0"
                  style="height: 90%; width: 70%; overflow-y: scroll; overflow-x: hidden"
                >
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
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PlayerStatItem from "@port-of-mars/client/components/dashboard/PlayerStatItem.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";
import Footer from "@port-of-mars/client/components/global/Footer.vue";
import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import { GameMeta, PlayerTaskCompletion, Stats } from "@port-of-mars/shared/types";
import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  REGISTER_PAGE,
  LOBBY_PAGE,
  LOGIN_PAGE,
  SIGNEDUP_PAGE,
  TUTORIAL_PAGE
} from "@port-of-mars/shared/routes";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { CalendarEvent, google } from "calendar-link";
import ActionItem from "@port-of-mars/client/components/dashboard/ActionItem.vue";

library.add(faGoogle, faRocket);

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
  view: "schedule" | "stats" = "schedule";
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

  get gamesPlayedCount() {
    return this.stats.games.length;
  }

  get join() {
    return { name: LOBBY_PAGE };
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

  switchTab(view: "schedule" | "stats"): void {
    this.view = view;
  }

  logout(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({ name: LOGIN_PAGE });
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
