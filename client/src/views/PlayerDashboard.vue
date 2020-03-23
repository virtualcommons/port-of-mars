<template>
    <div class="player-dashboard">
        <UserHeader />
        <h1>Port of Mars</h1>
        <h2>Your Dashboard</h2>
        <div class="left">

            <!-- onboarding -->
            <div class="top">
                <h3>Onboarding</h3>
                <p>Pass Tutorial Quiz</p>
                <p>Take Introduction Survey</p>
                <p>Take Exit Survey</p>
            </div>

            <!-- player stats -->
            <div class="bottom">
                <h3>Your Stats</h3>
                <p>Games Played: 1 (1 in progress)</p>
            </div>
        </div>
        
        <!-- action items -->
        <div class="middle">
            <h3>Action Items</h3>
        </div>

        <!-- upcoming games -->
        <div class="right">
            <h3>Upcoming Games</h3>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UserHeader from '@port-of-mars/client/components/global/UserHeader.vue';

@Component({
    components: {
        UserHeader
    }
})
export default class PlayerDashboard extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/PlayerDashboard.scss';
</style>