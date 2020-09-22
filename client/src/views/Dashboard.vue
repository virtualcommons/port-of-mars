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

    <b-row v-if="dashboardMessages.length > 0" class='justify-content-md-center'>
      <!-- MESSAGES -->
      <b-alert v-for="dm in dashboardMessages" :key="dm.message" :variant="dm.kind" dismissible fade
               show>
        {{ dm.message }}
      </b-alert>
    </b-row>

    <b-row class="justify-content-md-center">

      <!-- participate -->
      <b-col v-if="view === 'participate'" class="text-center" cols="6">
        <!-- TOURNAMENT SURVEYS -->
        <h2 class="text-center text-uppercase mt-5 py-2">Surveys</h2>

        <b-button-group class="py-3 mb-5 w-100" vertical>
          <b-button :href="introSurveyUrl" target="_blank" block
                    class="my-2" size="lg" variant="secondary">
            Complete introductory survey (required)
            <b-icon-check-circle-fill v-if="!playerTaskCompletion.mustTakeIntroSurvey"
                                      class="my-2" scale="0.8" variant="success"></b-icon-check-circle-fill>
            <b-icon-x-circle-fill v-else v-b-tooltip.hover class="m-2" scale="0.8" title="Need to complete"
                                  variant="danger"></b-icon-x-circle-fill>
          </b-button>

          <b-button :disabled="!roundComplete"
                    :href="roundExitSurveyUrl"
                    target="_blank"
                    block
                    size="lg"
                    variant="secondary">
            <span v-if="roundComplete">Please take exit survey</span>
            <span v-else>Exit survey will be available after you participate</span>
            <b-icon-check-circle-fill v-if="roundExitSurveyComplete" class="m-2" scale="0.8"
                                      variant="success"></b-icon-check-circle-fill>
            <b-icon-x-circle-fill v-else v-b-tooltip.hover class="m-2" scale="0.8" title="Need to complete"
                                  variant="danger"></b-icon-x-circle-fill>

          </b-button>
        </b-button-group>

        <!-- GO TO WAITING LOBBY -->
        <h2 class="py-2 text-uppercase">Participate</h2>
        <b-button :disabled="this.playerTaskCompletion.canPlayGame" :to="join" class="mb-5" pill size="lg"
                  variant="success">
          <b-icon-play-fill class="my-1 mx-2" scale="1"/>
        </b-button>


        <b-container v-if="playerTaskCompletion.canPlayGame" class="text-center">
          <h2 class="text-uppercase pt-5 my-3">Schedule</h2>
          <b-table :items="schedule" bordered class="py-3" dark responsive small
                   sticky-header striped>
            <template v-slot:cell(addToCalendar)="data">
              <a target="_blank" :href="inviteLink(data.item.addToCalendar)">
                <font-awesome-icon :icon="['fab', 'google']"/>
              </a>
            </template>
          </b-table>
        </b-container>
      </b-col>

      <!-- STATS -->
      <b-col v-if="view === 'stats'" class="text-center my-5 p-5 wrapper" cols="6">
        <h2 class="text-uppercase">You have participated in <b>{{ gamesPlayedCount }}</b> missions.</h2>
        <div class="stats w-100 h-100 p-0 m-0">    <b-row v-if="messages.length > 0" class='justify-content-md-center'>
      <!-- MESSAGES -->
      <b-alert v-for="dm in messages" :key="dm.message" :variant="dm.kind" dismissible fade show>
        {{ dm.message }}
      </b-alert>
    </b-row>

          <p v-if="stats.games.length === 0" class="my-5 py-5">No player stats to display</p>
          <PlayerStatItem
            v-for="playerStatItem in stats.games"
            :key="playerStatItem.time"
            :playerStatItem="playerStatItem"
            class="my-5 py-5"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import PlayerStatItem from '@port-of-mars/client/components/dashboard/PlayerStatItem.vue';
import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
import {GameMeta, PlayerTaskCompletion, Stats} from '@port-of-mars/shared/types';
import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
import {library} from '@fortawesome/fontawesome-svg-core'
import {CONSENT_PAGE, LOBBY_PAGE, LOGIN_PAGE, TUTORIAL_PAGE} from '@port-of-mars/shared/routes';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {CalendarEvent, google} from "calendar-link";
import ActionItem from "@port-of-mars/client/components/dashboard/ActionItem.vue";

library.add(faGoogle);

Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    ActionItem,
    PlayerStatItem,
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
  tournamentIntroductionUrl = '#/dashboard';
  tournamentIntroductionComplete = true;
  roundEntranceSurveyUrl = '#/dashboard';
  roundEntranceSurveyComplete = '#/dashboard';
  roundExitSurveyUrl = '#/dashboard';
  roundExitSurveyComplete = false;
  roundComplete = false;
  playerTaskCompletion: PlayerTaskCompletion = {
    mustConsent: true,
    mustVerifyEmail: true,
    mustTakeTutorial: true,
    mustTakeIntroSurvey: true,
    canPlayGame: false,
    shouldTakeExitSurvey: false
  };
  // FIXME: this needs to be pulled from the server side
  schedule: Array<{ day: string, time: string, addToCalendar: CalendarEvent }> = [
    {
      day: '',
      time: '',
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

  get dashboardMessages() {
    return this.$tstore.state.dashboardMessages;
  }

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
    console.log(data.upcomingGames);

    // set upcoming games
    /* FIXME: not sure why but data.upcomingGames are already observable (in the console)
    this.upcomingGames.splice(
      0,
      data.upcomingGames.length,
      ...data.upcomingGames
    );
    */
    this.upcomingGames = data.upcomingGames;
    this.schedule = data.upcomingGames.map((game) => { 
      const scheduledDate = new Date(game.time);
      return {
          day: scheduledDate.toDateString(),
          time: scheduledDate.toTimeString(),
          addToCalendar: {
            title: `Participate in Port of Mars Experiment, Round ${game.round}`,
            location: 'https://alpha.portofmars.asu.edu/#/',
            start: scheduledDate,
            duration: [2, "hour"],
            description: 'https://alpha.portofmars.asu.edu/#/'
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

  complete() {
    if (this.tournamentIntroductionComplete || this.roundExitSurveyComplete) return '$danger';
    return '$success';
  }

}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
