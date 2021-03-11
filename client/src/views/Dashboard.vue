<template>
  <b-container class="vh-100 p-0 m-0" fluid>
    <b-navbar fixed toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand href="#/dashboard"><h4 class="text-uppercase">Player Dashboard</h4></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="px-3">
          <b-nav-item @click="switchTab('participate')">Participate</b-nav-item>
          <b-nav-item @click="switchTab('stats')">Your Stats</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <b-dropdown-text variant="info">
              {{ username }}
            </b-dropdown-text>
            <b-dropdown-divider></b-dropdown-divider>

            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>
                <b-icon-person-fill variant="light"></b-icon-person-fill>
              </em>
            </template>

            <router-link :to="'register'">
              <b-dropdown-item-button>
                Change Consent or Email
              </b-dropdown-item-button>
            </router-link>
            <router-link :to="'tutorial'">
              <b-dropdown-item-button>
                Tutorial
              </b-dropdown-item-button>
            </router-link>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button variant="danger" @click="logout">Logout</b-dropdown-item-button>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-row class="text-center">
      <Messages/>
    </b-row>

    <b-row class="text-center h-75">
      <!-- participate -->
      <b-col v-if="view === 'participate'" class="text-center">
        <!-- TOURNAMENT SURVEYS -->
        <template v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.shouldTakeExitSurvey">
          <b-button-group class="py-3 w-75" vertical>
            <b-button v-if="playerTaskCompletion.mustTakeIntroSurvey" :href="introSurveyUrl" block size="lg" variant="success">
              <h1>
              <font-awesome-icon class='text-warning' icon="exclamation-triangle"/>
              Click here to take an intro survey before participating (REQUIRED)
              </h1>
            </b-button>
            <b-button v-if="playerTaskCompletion.shouldTakeExitSurvey" :href="exitSurveyUrl" block size="lg" variant="success">
              <h1>
              <font-awesome-icon class='text-warning' icon="exclamation-triangle" />
              Thanks for participating! Please click here to complete an exit survey.
              </h1>
            </b-button>
          </b-button-group>
        </template>
        <!-- go to waiting lobby -->

        <b-container v-if="playerTaskCompletion.mustTakeIntroSurvey" class="my-2 text-center">
          <h2 class="text-uppercase my-2">Please click the link above to complete a brief introductory survey before participating.</h2>
        </b-container>
        <b-container v-else-if="playerTaskCompletion.canPlayGame" class="my-2 text-center">
          <h2 class="text-uppercase my-2">Participate in Round {{ currentRoundNumber }}</h2>
          <b-button :to="join" size="lg" variant="success">
            Join the Waiting Lobby
            <font-awesome-icon icon="rocket"/>
          </b-button>
          <h2 class="text-uppercase mt-5 mb-3">Schedule</h2>
          <p class="lead text-left">Please sign in during <b>one</b> of the following times to participate. We recommend that
            you show up 5 minutes earlier to join the waiting lobby.
          </p>
          <div style="overflow-y: auto !important;">
            <b-table :items="schedule" bordered class="py-3" stacked="md" small dark striped>
              <template v-slot:cell(addToCalendar)="data">
                <a :href="inviteLink(data.item.addToCalendar)" target="_blank">
                  <font-awesome-icon :icon="['fab', 'google']"/>
                </a>
              </template>
            </b-table>
          </div>
        </b-container>
        <!-- invite + participation status -->
        <b-container v-else-if="! playerTaskCompletion.hasInvite">
          <h2 class="text-center text-uppercase mt-5 py-2">No active invitation found</h2>
          <p class='lead text-left'>
            Thanks for your interest in the Port of Mars! Unfortunately you do not appear to have an invitation to participate
            in this round of the Port of Mars. If you think this is an error, please contact us at
            <a href='mailto:portmars@asu.edu'>portmars@asu.edu</a>.
          </p>
        </b-container>
        <b-container v-else>
          <h2 class="text-center text-uppercase mt-5 py-2">Already Participated</h2>
          <p class='lead text-left'>
            Thanks for participating in the Port of Mars!
            <a v-if="playerTaskCompletion.shouldTakeExitSurvey" :href='exitSurveyUrl'>Please complete our exit survey by
              clicking this link.</a>
            We will email you with further instructions if you are eligible to participate in the next round.
            You can review your past games by clicking <code>Your Stats</code> in the navbar above.
          </p>
        </b-container>
      </b-col>

      <!-- STATS -->
      <b-col v-if="view === 'stats'" class="text-center mt-5">
        <h2 class="text-uppercase">You have participated in <b>{{ gamesPlayedCount }}</b> missions</h2>
        <b-container>
          <b-container class="wrapper">
            <p v-if="stats.games.length === 0" class="my-5 py-5">No games to display.</p>
            <PlayerStatItem
              v-for="playerStatItem in stats.games"
              :key="playerStatItem.time"
              :playerStatItem="playerStatItem"
              class="my-1 py-1"
            />
          </b-container>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PlayerStatItem from '@port-of-mars/client/components/dashboard/PlayerStatItem.vue';
import Messages from '@port-of-mars/client/components/dashboard/Messages.vue';
import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
import {GameMeta, PlayerTaskCompletion, Stats} from '@port-of-mars/shared/types';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
import {faRocket} from '@fortawesome/free-solid-svg-icons';
import {library} from '@fortawesome/fontawesome-svg-core'
import {REGISTER_PAGE, LOBBY_PAGE, LOGIN_PAGE, SIGNEDUP_PAGE, TUTORIAL_PAGE} from '@port-of-mars/shared/routes';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {CalendarEvent, google} from "calendar-link";
import ActionItem from "@port-of-mars/client/components/dashboard/ActionItem.vue";

library.add(faGoogle, faRocket);

Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    ActionItem,
    PlayerStatItem,
    Messages,
  },
})
export default class PlayerDashboard extends Vue {
  username: string = this.$tstore.state.user.username;
  view: 'participate' | 'stats' = 'participate';
  api!: DashboardAPI;
  loading = true;
  upcomingGames: Array<GameMeta> = [];
  introSurveyUrl: string = '';
  exitSurveyUrl: string = '';
  currentRoundNumber: number = 1;
  playerTaskCompletion: PlayerTaskCompletion = {
    mustConsent: true,
    mustVerifyEmail: true,
    mustTakeTutorial: true,
    mustTakeIntroSurvey: true,
    canPlayGame: false,
    shouldTakeExitSurvey: false,
    hasInvite: false,
  };
  schedule: Array<{ date: string, addToCalendar: CalendarEvent }> = [
    {
      date: '',
      addToCalendar: {
        title: '',
        location: '',
        start: '',
        duration: [0, 'hour'],
        description: ''
      }
    },
  ];
  private stats: Stats = {games: []};

  get gamesPlayedCount() {
    return this.stats.games.length;
  }

  get join() {
    return {name: LOBBY_PAGE};
  }

  created() {
    this.api = new DashboardAPI(this.$tstore, this.$ajax);
    this.initialize();
  }

  inviteLink(invite: { title: string, location: string, start: Date, end: Date, details: string }) {
    return google(invite);
  }

  async initialize() {
    // get player task completion status
    const data = await this.api.getData();
    this.$set(this, 'playerTaskCompletion', data.playerTaskCompletion);

    // go to email verification page if player is not verified
    if (data.playerTaskCompletion.mustVerifyEmail) {
      await this.$router.push({name: REGISTER_PAGE});
    }

    // go to consent page if player has not consented
    else if (data.playerTaskCompletion.mustConsent) {
      await this.$router.push({name: REGISTER_PAGE});
    }

    // go to the signed up page if signup is enabled
    else if (data.isSignUpEnabled) {
      await this.$router.push({name: SIGNEDUP_PAGE});
    }

    // go to tutorial if player has not taken tutorial
    else if (data.playerTaskCompletion.mustTakeTutorial) {
      await this.$router.push({name: TUTORIAL_PAGE});
    }

    // set survey URLs
    this.$set(this, 'introSurveyUrl', data.introSurveyUrl);
    this.$set(this, 'exitSurveyUrl', data.exitSurveyUrl);
    this.$set(this, 'currentRoundNumber', data.currentRoundNumber);

    // set player stats
    this.stats.games.splice(0, this.stats.games.length, ...data.stats.games);
    this.upcomingGames = data.upcomingGames;
    this.schedule = data.upcomingGames.map((game) => {
      const scheduledDate = new Date(game.time);
      return {
        date: scheduledDate.toLocaleString(),
        addToCalendar: {
          title: `Participate in Port of Mars Experiment, Round ${game.round}`,
          location: 'https://portofmars.asu.edu/',
          start: scheduledDate,
          duration: [2, "hour"],
          description: 'https://portofmars.asu.edu/'
        }
      };
    });
    this.loading = false;
  }

  switchTab(view: 'participate' | 'stats'): void {
    this.view = view;
  }

  logout(): void {
    this.$ajax.forgetLoginCreds();
    this.$router.push({name: LOGIN_PAGE});
  }

}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
