<template>
  <b-alert class="bg-light border-0 m-0 rounded-0" variant="dark" show>
    <div class="d-flex justify-content-center align-items-center">
      <div class="text-center mw-50 mx-3">
        <h4>
          Mars Madness {{ $tstore.getters.tournamentStartMonthYear }}
          <span v-if="status.currentRound.round === 1">is starting!</span>
          <span v-else>is active!</span>
        </h4>
        <p>
          <small>{{ status.description }}</small>
        </p>
        <p class="mb-0">
          {{ status.currentRound.announcement }}
        </p>
      </div>
      <div class="mx-3">
        <Countdown size="2" :nextLaunch="$tstore.getters.nextLaunchTime"></Countdown>
        <b-button variant="success" :to="tournamentDashboard" class="text-nowrap mx-2">
          <b>See the schedule and get prepared!</b>
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
    return this.$store.getters.tournamentStatus;
  }
}
</script>

<style lang="scss" scoped></style>
