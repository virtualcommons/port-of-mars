<template>
  <div class="c-dashboard">
    <div class="container">
      <img
        :src="require(`@port-of-mars/client/assets/marsbg.jpg`)"
        alt="Background Image"
        class="background-image"
      />

      <!-- HEADER -->
      <b-row class="title-wrapper">
        <b-col class="title mt-5">
          <h1>Player Dashboard</h1>
        </b-col>
      </b-row>

      <b-row class="message-wrapper">
        <!-- MESSAGES -->
        <h2>Messages</h2>
        <b-alert :key="dm.message" :variant="dm.kind" show dismissible fade
                 v-for="dm in dashboardMessages">
          {{ dm.message }}
        </b-alert>
      </b-row>

      <!-- DASHBOARD ITEMS -->
      <b-row class="content-wrapper">

        <!-- STATS -->
        <b-col class="stats">

              <h2>Your Stats</h2>

              <div class="games-played">
                <p class="text-center">Games Played: {{ gamesPlayedCount }}</p>
              </div>

              <div class="outer-wrapper">
                <PlayerStatItem
                  :key="playerStatItem.time"
                  :playerStatItem="playerStatItem"
                  v-for="playerStatItem in stats.games"
                />
              </div>

        </b-col>

        <!-- ACTION ITEMS -->
        <b-col class="action-items">
          <h2>Action Items</h2>
          <div class="next-game">
            <UpcomingGameItem
              :key="upcomingGame.time"
              :upcomingGame="upcomingGame"
              v-for="upcomingGame in upcomingGames"
            />
          </div>
          <div class="outer-wrapper">
<!--            <div class="wrapper">-->
              <p v-if="loading">Action Items are loading...</p>
              <ActionItemComponent
                :actionItem="actionItem"
                :key="actionItem.description"
                v-for="actionItem in actionItems"
              />
<!--            </div>-->
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins, Prop, Vue} from 'vue-property-decorator';
  import ActionItemComponent from '@port-of-mars/client/components/dashboard/ActionItem.vue';
  import UpcomingGameItem from '@port-of-mars/client/components/dashboard/UpcomingGameItem.vue';
  import PlayerStatItem from '@port-of-mars/client/components/dashboard/PlayerStatItem.vue';
  import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
  import {ActionItem, DashboardData, GameMeta,} from '@port-of-mars/shared/types';
  import {LOBBY_PAGE} from "@port-of-mars/shared/routes";

  @Component({
    components: {
      ActionItemComponent,
      UpcomingGameItem,
      PlayerStatItem,
    },
  })
  export default class PlayerDashboard extends Mixins(Vue, DashboardAPI) {
    private loading = true;
    private actionItems: Array<ActionItem> = [];
    private stats: DashboardData['stats'] = {games: []};
    private upcomingGames: Array<GameMeta> = [];

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
  }
</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
