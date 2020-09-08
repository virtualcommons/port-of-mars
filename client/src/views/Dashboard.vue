<template>
  <b-container fluid class="m-0 p-0">

    <!-- NAVIGATION BAR -->
    <b-navbar type="dark" variant="info">
      <b-navbar-brand href="#">Player Dashboard</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Tutorial</b-nav-item>
          <b-nav-item href="#" disabled>Game</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
<!--          <b-nav-form>-->
<!--            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>-->
<!--            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>-->
<!--          </b-nav-form>-->

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{ username }}</em>
            </template>
            <b-dropdown-item @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- TOURNAMENT INTRODUCTION SURVEY -->
    <b-row class="justify-content-center m-4">
      <b-col>
        <b-list-group class="px-0">
          <b-list-group-item :href="tournamentIntroductionUrl"
                             class="d-flex justify-content-between align-items-center">
            Tournament Introduction Survey
            <b-badge variant="primary">
              <b-icon-check v-if="tournamentIntroductionComplete"></b-icon-check>
              <b-icon-x-circle v-else></b-icon-x-circle>
            </b-badge>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>

    <!-- TOURNAMENT EXIT SURVEY -->
    <b-row class="justify-content-center" v-if="roundComplete">
      <b-list-group class="px-0">
        <b-list-group-item :href="roundExitSurveyUrl"
                           class="d-flex justify-content-between align-items-center">
          Tournament Exit Survey
          <b-badge variant="primary">
            <b-icon-check v-if="roundExitSurveyComplete"></b-icon-check>
            <b-icon-x-circle v-else></b-icon-x-circle>
          </b-badge>
        </b-list-group-item>
      </b-list-group>
    </b-row>

    <b-row class="justify-content-center p-4" v-if="playerTaskCompletion.canPlayGame">
      <b-col>
        <h2>Schedule</h2>
        <b-table responsive sticky-header small dark bordered striped
                 :items="schedule">
          <template v-slot:cell(invite)="data">
            <a :href="inviteLink(data.item.invite)"><font-awesome-icon :icon="['fab', 'google']" /></a>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import PlayerStatItem from '@port-of-mars/client/components/dashboard/PlayerStatItem.vue';
  import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
  import {PlayerTaskCompletion, GameMeta,} from '@port-of-mars/shared/types';
  import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
  import { library } from '@fortawesome/fontawesome-svg-core'

  import { CONSENT_PAGE, LOGIN_PAGE, VERIFY_PAGE, TUTORIAL_PAGE, GAME_PAGE } from '@port-of-mars/shared/routes';

  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {google, outlook, office365, yahoo, ics, CalendarEvent} from "calendar-link";

  library.add(faGoogle);

  Vue.component('font-awesome-icon', FontAwesomeIcon);

  @Component({
    components: {
      PlayerStatItem,
    },
  })
  export default class PlayerDashboard extends Vue {
    username: string = this.$tstore.state.user.username;
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
    }

    tournamentIntroductionUrl = '#/dashboard';
    tournamentIntroductionComplete = true;

    roundEntranceSurveyUrl = '#/dashboard';
    roundEntranceSurveyComplete = '#/dashboard';
    roundExitSurveyUrl = '#/dashboard';
    roundExitSurveyComplete = false;
    roundComplete = false;

    schedule: Array<{ day: string, time: string, invite: CalendarEvent }> = [
      {
        day: 'Thursday, Oct 7',
        time: '16:00',
        invite: {
          title: 'Round 2',
          location: 'Port of Mars',
          start: new Date().toISOString(),
          duration: [3, "hour"],
          description: 'A scheduled port of mars game'
        }
      },
      {
        day: 'Thursday, Oct 8',
        time: '08:00',
        invite: {
          title: 'Round 2',
          location: 'Port of Mars',
          start: new Date().toISOString(),
          duration: [3, "hour"],
          description: 'A scheduled port of mars game'
        }
      }
    ]

    created() {
      this.api = new DashboardAPI(this.$tstore, this.$ajax);
      this.initialize();
    }

    inviteLink(invite: {title: string, location: string, start: Date, end: Date, details: string}) {
      console.log({invite});
      return google(invite);
    }

    get dashboardMessages() {
      return this.$tstore.state.dashboardMessages;
    }

    async initialize() {
      // get player task completion status
      const data = await this.api.getData();
      this.$set(this, 'playerTaskCompletion', data.playerTaskCompletion);

      // go to email verification page if player is not verified
      if (data.playerTaskCompletion.mustVerifyEmail) {
        await this.$router.push({name: VERIFY_PAGE});
      }

      // go to consent page if player has not consented
      else if (data.playerTaskCompletion.mustConsent) {
        await this.$router.push({name: CONSENT_PAGE});
      }

      // go to tutorial if player has not taken tutorial
      else if (data.playerTaskCompletion.mustTakeTutorial) {
        await this.$router.push({name: TUTORIAL_PAGE});
      }

      this.$set(this, 'introSurveyUrl', data.introSurveyUrl);
      this.$set(this, 'exitSurveyUrl', data.exitSurveyUrl);
      this.upcomingGames.splice(
        0,
        this.upcomingGames.length,
        ...data.upcomingGames
      );
      this.loading = false;
    }

    private logout(): void {
      this.$ajax.forgetLoginCreds();
      this.$router.push({ name: LOGIN_PAGE });
    }

  }
</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
