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
  import {ActionItem, DashboardData, GameMeta,} from '@port-of-mars/shared/types';
  import {faGoogle} from '@fortawesome/free-brands-svg-icons/faGoogle';
  import { library } from '@fortawesome/fontawesome-svg-core'

  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import { google, outlook, office365, yahoo,  ics } from "calendar-link";

  library.add(faGoogle);

  Vue.component('font-awesome-icon', FontAwesomeIcon);

  @Component({
    components: {
      PlayerStatItem,
    },
  })
  export default class PlayerDashboard extends Mixins(Vue, DashboardAPI) {
    private loading = true;
    private actionItems: Array<ActionItem> = [];
    private stats: DashboardData['stats'] = {games: []};
    private upcomingGames: Array<GameMeta> = [];
    private view: 'stats' | 'schedule' = 'schedule';
    private scheduleColNames = ['Day', 'Time', 'Invite'];
    private schedule = [
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

    inviteLink(invite: {title: string, location: string, start: Date, end: Date, details: string}) {
      console.log({invite});
      return google(invite);
    }

    event = {
      title: "My birthday party",
      description: "Be there!",
      start: "2019-12-29 18:00:00 +0100",
      duration: [3, "hour"]
    };

    get eventLink() {
      return google(this.event);
    }

    get dashboardMessages() {
      return this.$tstore.state.dashboardMessages;
    }

    get gamesPlayedCount() {
      return this.stats.games.length;
    }

    async mounted() {
      await this.initialize();
    }

    async initialize() {
      const data = await this.getData();
      this.actionItems = data.actionItems;
      this.stats.games.splice(0, this.stats.games.length, ...data.stats.games);
      this.upcomingGames.splice(
        0,
        this.upcomingGames.length,
        ...data.upcomingGames
      );
      this.loading = false;
    }

    private switchView(toggle: 'stats' | 'schedule') {
      this.view = toggle;
    }

    private logoutUser(): void {
      this.$ajax.forgetLoginCreds();
      this.$router.push({ name: 'Login' });
    }

  }
</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
