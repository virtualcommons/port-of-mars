<template>
    <BRow class="player-dashboard">
        <BCol class="left">
            <!-- player stats -->
            <div class="bottom">
                <h2>Your Stats</h2>
                <p>Games Played: {{ gamesPlayedCount }}</p>
                <div class="player-stat-item" v-for="gs in stats.games">
                    <p class="player-stat-item-header">Tournament Name: {{ gs.tournamentName }}</p>
                    <p class="player-stat-item-header">{{ new Date(gs.time).toDateString() }}</p>
                    <p>Round: {{ gs.round }}</p>
                    <p>Winner: {{ gs.winner }}</p>
                    <p>Points: {{ gs.points }}</p>
                </div>
            </div>
        </BCol>

        <!-- action items -->
        <BCol class="middle">
            <div class="top">
                <h1>Port of Mars</h1>
                <h2>Player Dashboard</h2>
            </div>

            <div class="bottom">
                <h2>Action Items</h2>
                <div class="error-messages">
                    <h3 v-if="errors.length > 0">
                        Errors
                    </h3>
                    <b-alert v-for="(error, index) in errors" :key="error.message" @dismissed="dismissError(index)" variant="danger" dismissible show="true">
                        {{ error.message }}
                    </b-alert>
                </div>
                <div v-if="loading">
                    <p>Action Items are loading...</p>
                </div>
                <div v-else>
                    <div v-for="action in actionItems" class="action-item">
                        <p>{{action.description}}</p>
                        <BButton squared class="button" variant="dark" :to="action.link.data" v-if="isInternal(action.link)">Go</BButton>
                        <BButton squared class="button" variant="dark" :href="action.link.data" v-else>Go</BButton>
                    </div>
                </div>
            </div>
        </BCol>

        <!-- upcoming games -->
        <BCol class="right">
            <h2>Upcoming Games</h2>
            <div class="upcoming-game-item" v-for="game in upcomingGames">
                <p>{{ toTimeString(game.time) }}</p>
                <BButton squared class="button" variant="dark" disabled><router-link :to="joinLink">Join</router-link></BButton>
            </div>
        </BCol>
    </BRow>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { BRow, BCol, BButton, BLink } from 'bootstrap-vue';
import {DashboardAPI} from '@port-of-mars/client/api/dashboard/request';
import {ActionItem, DashboardData, GameMeta} from '@port-of-mars/shared/types';
import {LOBBY_NAME} from "@port-of-mars/shared/lobby";
import {LOBBY_PAGE} from "@port-of-mars/shared/routes";

@Component({
    components: {
        BButton,
        BLink,
        BRow,
        BCol
    },
})
export default class PlayerDashboard extends Mixins(Vue, DashboardAPI) {
    private visible = false;
    private loading = true;
    private actionItems:Array<ActionItem> = [];
    private stats: DashboardData['stats'] = {games: []};
    private upcomingGames: Array<GameMeta> = [];

    async mounted(){
      await this.initialize();
    }

    async initialize() {
      const data = await this.getData();
      console.log(data);
      this.actionItems = data.actionItems;
      this.stats.games.splice(0, this.stats.games.length, ...data.stats.games);
      this.upcomingGames.splice(0, this.upcomingGames.length, ...data.upcomingGames);
      this.loading = false;
    }

    get errors() {
      return this.$tstore.state.errors;
    }

    dismissError(index: number) {
      this.$tstore.commit('DISMISS_ERROR_MESSAGE', index);
    }

    get joinLink() {
      return { name: LOBBY_PAGE };
    }

    get gamesPlayedCount() {
      return this.stats.games.length;
    }

    isInternal(link: ActionItem['link']) {
      return link.kind === 'internal';
    }

    toTimeString(unixtimestamp: number): string {
      return new Date(unixtimestamp).toLocaleTimeString()
    }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/Dashboard.scss';
</style>
