<template>
  <b-container>
    <b-row>
      <h1>Player Dashboard</h1>
    </b-row>
    <b-row>
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
    <b-row>
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
    <b-row v-if="roundComplete">
      <b-list-group class="px-0">
        <b-list-group-item :href="roundExitSurveyUrl"
                           class="d-flex justify-content-between align-items-center">
          Tournament Introduction Survey
          <b-badge variant="primary">
            <b-icon-check v-if="roundExitSurveyComplete"></b-icon-check>
            <b-icon-x-circle v-else></b-icon-x-circle>
          </b-badge>
        </b-list-group-item>
      </b-list-group>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import {Component, Mixins, Vue} from 'vue-property-decorator';
  import PlayerStatItem from '@port-of-mars/client/components/dashboard/PlayerStatItem.vue';
  import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
  import {PlayerTaskCompletion, DashboardData, GameMeta,} from '@port-of-mars/shared/types';
  import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
  import { library } from '@fortawesome/fontawesome-svg-core'

  import { REGISTER_PAGE, LOGIN_PAGE, LOBBY_PAGE, VERIFY_PAGE, TUTORIAL_PAGE, GAME_PAGE } from '@port-of-mars/shared/routes';

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
    private api!: DashboardAPI;
    private loading = true;
    private upcomingGames: Array<GameMeta> = [];
    private schedule: Array<{ day: string, time: string, invite: CalendarEvent }> = [
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

    tournamentIntroductionUrl = '#/dashboard';
    tournamentIntroductionComplete = true;

    roundEntranceSurveyUrl = '#/dashboard';
    roundEntranceSurveyComplete = '#/dashboard';
    roundExitSurveyUrl = '#/dashboard';
    roundExitSurveyComplete = false;
    roundComplete = false;

    created() {
      console.log("creating dashboard API");
      this.api = new DashboardAPI(this.$tstore, this.$ajax);
      console.log("created dashboard api");
    }

    async mounted() {
      console.log("initializing dashboard");
      await this.initialize();
      console.log('initialized');
    }

    inviteLink(invite: {title: string, location: string, start: Date, end: Date, details: string}) {
      console.log({invite});
      return google(invite);
    }

    get dashboardMessages() {
      return this.$tstore.state.dashboardMessages;
    }

    async initialize() {
      const data = await this.api.getData();
      const playerTaskCompletion: PlayerTaskCompletion = data.playerTaskCompletion;
      // display email verification page if not verified
      if (playerTaskCompletion.mustVerifyEmail) {
        this.$router.push({name: VERIFY_PAGE});
      }
      else if (playerTaskCompletion.mustProvideConsent) {
        // FIXME: rename REGISTER_PAGE to CONSENT_PAGE
        this.$router.push({name: REGISTER_PAGE});
      }
      else if (playerTaskCompletion.mustTakeTutorial) {
        this.$router.push({name: TUTORIAL_PAGE});
      }
      this.upcomingGames.splice(
        0,
        this.upcomingGames.length,
        ...data.upcomingGames
      );
      this.loading = false;
    }

    private logoutUser(): void {
      this.$ajax.forgetLoginCreds();
      this.$router.push({ name: LOGIN_PAGE });
    }

  }
</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
