<template>
  <b-container class="m-0 p-0 h-100" fluid>
    <img
      :src="require(`@port-of-mars/client/assets/marsbg.jpg`)"
      alt="Background Image"
      class="background-image"
    />

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

    <b-row class='justify-content-md-center'>
      <Messages />
    </b-row>

    <b-row class="justify-content-md-center">

      <!-- participate -->
      <b-col v-if="view === 'participate'" class="text-center">
        <!-- TOURNAMENT SURVEYS -->
        <template v-if="playerTaskCompletion.mustTakeIntroSurvey || playerTaskCompletion.shouldTakeExitSurvey">
          <h2 class="text-center text-uppercase pt-5 my-2">Surveys</h2>
          <b-button-group class="py-3 mb-5 w-100" vertical>
            <b-button v-if="playerTaskCompletion.mustTakeIntroSurvey" :href="introSurveyUrl" block class="my-2" size="lg" variant="secondary">
              Please complete this introductory survey before participating <span class='text-danger'>*</span>
            </b-button>
            <b-button v-if="playerTaskCompletion.shouldTakeExitSurvey" :href="exitSurveyUrl" block size="lg" variant="secondary">
              Please complete this exit survey <span class='text-danger'>*</span>
            </b-button>
          </b-button-group>
        </template>
        <b-container v-if="playerTaskCompletion.canPlayGame" class="text-center">
          <!-- GO TO WAITING LOBBY -->
          <h2 class="pt-5 my-3 text-uppercase">Participate</h2>
          <b-button :to="join" pill size="lg" variant="success">
            Ready to Launch - Join the Waiting Lobby <font-awesome-icon icon="rocket" />
          </b-button>
          <h2 class="text-uppercase pt-5 my-3">Schedule</h2>
          <p class='lead text-left '>Please login during one of the following times to participate. We recommend that you show up 5 minutes earlier to 
            join the waiting lobby.
          </p>

          <b-table :items="schedule" bordered class="py-3" dark responsive sticky-header striped>
            <template v-slot:cell(addToCalendar)="data">
              <a target="_blank" :href="inviteLink(data.item.addToCalendar)">
                <font-awesome-icon :icon="['fab', 'google']"/>
              </a>
            </template>
          </b-table>
        </b-container>
        <b-container v-else>
          <h2 class="text-center text-uppercase mt-5 py-2">Already Participated</h2>
          <p class='lead text-left'>
            Thanks for participating in the Port of Mars! 
            <a :href='exitSurveyUrl' v-if="playerTaskCompletion.shouldTakeExitSurvey">Please complete our exit survey by clicking this link.</a>
            We will email you with further instructions if you are eligible to participate in the next round.
            You can review your past games by clicking <code>Your Stats</code> in the navbar above.
          </p>
        </b-container>
      </b-col>

      <!-- STATS -->
      <b-col v-if="view === 'stats'" class="stats text-center my-2 p-2">
        <h2 class="text-uppercase">You have participated in <b>{{ gamesPlayedCount }}</b> missions</h2>
        <b-container class="py-0 my-0">
          <p v-if="stats.games.length === 0" class="my-5 py-5">No games to display.</p>
          <PlayerStatItem
            v-for="playerStatItem in stats.games"
            :key="playerStatItem.time"
            :playerStatItem="playerStatItem"
            class="my-1 py-1"
          />
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
import {CONSENT_PAGE, LOBBY_PAGE, LOGIN_PAGE, TUTORIAL_PAGE} from '@port-of-mars/shared/routes';

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
  playerTaskCompletion: PlayerTaskCompletion = {
    mustConsent: true,
    mustVerifyEmail: true,
    mustTakeTutorial: true,
    mustTakeIntroSurvey: true,
    canPlayGame: false,
    shouldTakeExitSurvey: false
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
      await this.$router.push({name: CONSENT_PAGE});
    }

    // go to consent page if player has not consented
    else if (data.playerTaskCompletion.mustConsent) {
      await this.$router.push({name: CONSENT_PAGE});
    }

    // go to tutorial if player has not taken tutorial
    else if (data.playerTaskCompletion.mustTakeTutorial) {
      await this.$router.push({name: TUTORIAL_PAGE});
    }

    // set survey URLs
    this.$set(this, 'introSurveyUrl', data.introSurveyUrl);
    console.log(this.introSurveyUrl);
    this.$set(this, 'exitSurveyUrl', data.exitSurveyUrl);
    console.log(this.exitSurveyUrl);

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