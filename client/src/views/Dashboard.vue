<template>
  <div class="c-player-dashboard outer-container">
    <div class="player-dashboard container">
      <div class="title-wrapper row">
        <div class="title col-12">
          <h1>Port of Mars</h1>
          <h2>Player Dashboard</h2>
        </div>
      </div>
      <b-row class="content-wrapper">
        <b-col cols="3" class="stats">
          <b-row>
            <b-col>
              <h2>Messages</h2>
              <b-alert v-for="dm in dashboardMessages" :key="dm.message" :variant="dm.kind" show dismissible>
                {{ dm.message }}
              </b-alert>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h2>Your Stats</h2>
              <div class="information">
                <p>Games Played: {{ gamesPlayedCount }}</p>
              </div>
              <div class="outer-wrapper">
                <div class="wrapper">
                  <PlayerStatItem
                    v-for="playerStatItem in stats.games"
                    :playerStatItem="playerStatItem"
                    :key="playerStatItem.time"
                  />
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <div class="action-items col-4">
          <h2>Action Items</h2>
          <div class="outer-wrapper">
            <div class="wrapper">
              <p v-if="loading">Action Items are loading...</p>
              <ActionItemComponent
                v-for="actionItem in actionItems"
                :actionItem="actionItem"
                :key="actionItem.description"
              />
            </div>
          </div>
        </div>
        <div class="upcoming-games col-3">
          <h2>Upcoming Games</h2>
          <div class="outer-wrapper">
            <div class="wrapper">
              <UpcomingGameItem
                v-for="upcomingGame in upcomingGames"
                :upcomingGame="upcomingGame"
                :key="upcomingGame.time"
              />
            </div>
          </div>
        </div>
      </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import ActionItemComponent from '@port-of-mars/client/components/dashboard/ActionItem.vue';
import UpcomingGameItem from '@port-of-mars/client/components/dashboard/UpcomingGameItem.vue';
import PlayerStatItem from '@port-of-mars/client/components/dashboard/PlayerStatItem.vue';
import { DashboardAPI } from '@port-of-mars/client/api/dashboard/request';
import {
  ActionItem,
  DashboardData,
  GameMeta,
} from '@port-of-mars/shared/types';

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
  private stats: DashboardData['stats'] = { games: [] };
  private upcomingGames: Array<GameMeta> = [];

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

  get dashboardMessages() {
    console.log("dashboard messages");
    console.log(this.$tstore.state.dashboardMessages);
    return this.$tstore.state.dashboardMessages;
  }

  get gamesPlayedCount() {
    return this.stats.games.length;
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/views/Dashboard.scss";
</style>
