<template>
    <BRow class="player-dashboard">
        <BCol class="left">
            <!-- player stats -->
            <div class="bottom">
                <h2>Your Stats</h2>
                <p>Games Played: 1 (1 in progress)</p>
                <div class="player-stat-item">
                    <p class="player-stat-item-header">Game 1</p>
                    <p class="player-stat-item-header">20 March 2020 @ 10:00 A.M.</p>
                    <p>Status: Won</p>
                    <p>Points: 10</p>
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
                <div v-if="loading">
                    <p>Action Items are loading...</p>
                </div>

                <div v-else>
                    <div v-for="(item,index) in actionItems" :key="index" class="action-item">
                        <p>{{item.description}}</p>
                        <BButton squared class="button" variant="dark" :to="item.link">Go</BButton>
                    </div>
                </div>

                </div>
            </div>
        </BCol>

        <!-- upcoming games -->
        <BCol class="right">
            <h2>Upcoming Games</h2>
            <div class="upcoming-game-item">
                <p>April 1 @ 12:00 PM</p>
                <BButton squared class="button" variant="dark" disabled>Join</BButton>
            </div>
        </BCol>
    </BRow>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator';
import { BRow, BCol, BButton, BLink } from 'bootstrap-vue';
import DashboardAPI from '@port-of-mars/client/api/dashboard/dashboardAPI';
import { ActionItem } from '@port-of-mars/shared/types';

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

    async mounted(){
        await this.actionItemSet();
    }

    async actionItemSet(){
        this.actionItems = await this.getActionItems();
        this.actionItems.filter(item => {
            return item.done == false;
        })
        
        this.loading = false;
    }
    
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/PlayerDashboard.scss';
</style>