<template>
    <BRow class="player-dashboard">
        <UserHeader />
        <BCol class="left">
            <!-- onboarding -->
            <div class="top">
                <h2>Onboarding</h2>
                <p>Pass Tutorial Quiz</p>
                <p>Take Introduction Survey</p>
                <p>Take Exit Survey</p>
            </div>

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
                <div class="action-item">
                    <p>Connect to Current Game </p>
                    <BButton squared class="button" variant="dark">Go</BButton>
                </div>
                <div class="action-item">
                    <p>Take Exit Survey</p>
                    <BButton squared class="button" variant="dark">Go</BButton>
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
import { Vue, Component } from 'vue-property-decorator';
import UserHeader from '@port-of-mars/client/components/global/UserHeader.vue';
import { BRow, BCol, BButton } from 'bootstrap-vue';

@Component({
    components: {
        BButton,
        BRow,
        BCol,
        UserHeader
    }
})
export default class PlayerDashboard extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/PlayerDashboard.scss';
</style>