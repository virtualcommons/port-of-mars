<template>
  <b-alert class="bg-light border-0 m-0 rounded-0" variant="dark" show v-if="status">
    <div class="d-flex justify-content-center align-items-center">
      <div class="text-center mw-50 mx-3">
        <h4>Mars Madness is live</h4>
        <p>
          <small>{{ status.description }}</small>
        </p>
        <p class="mb-0" v-if="$tstore.getters.tournamentRoundHasUpcomingLaunch">
          {{ status.currentRound.announcement }}
        </p>
      </div>
      <div class="mx-3 text-center" v-if="!$tstore.getters.tournamentRoundHasUpcomingLaunch">
        <h4 class="mb-0">Round {{ status.currentRound.round }}:</h4>
        <p><b>No upcoming launch times</b></p>
        <b-button variant="success" :to="tournamentDashboard" class="text-nowrap mx-2">
          <p class="mb-0">Tournament Dashboard</p>
        </b-button>
      </div>
      <div class="mx-3 text-center" v-else-if="$tstore.getters.isTournamentLobbyOpen">
        <h4>Launching now!</h4>
        <b-button variant="success" :to="tournamentDashboard" class="text-nowrap mx-2">
          <p class="mb-0">Get prepared and join the lobby!</p>
        </b-button>
      </div>
      <div class="mx-3 text-center" v-else>
        <Countdown size="2" :nextLaunch="$tstore.getters.nextLaunchTime"></Countdown>
        <b-button variant="success" :to="tournamentDashboard" class="text-nowrap mx-2">
          <p class="mb-0">See the schedule and get prepared!</p>
        </b-button>
      </div>
    </div>
  </b-alert>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TOURNAMENT_DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";

@Component({
  components: {
    Countdown,
  },
})
export default class TournamentBanner extends Vue {
  tournamentDashboard = { name: TOURNAMENT_DASHBOARD_PAGE };

  get status() {
    return this.$tstore.getters.tournamentStatus;
  }
}
</script>

<style lang="scss" scoped></style>
