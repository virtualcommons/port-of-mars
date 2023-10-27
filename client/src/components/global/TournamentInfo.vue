<template>
  <div v-if="status">
    <h4>Mars Madness Tournament {{ shortMonthYear }}</h4>
    <p>{{ status.description }}</p>
    <b-alert show variant="success"
      ><b>{{ status.currentRound.announcement }}</b></b-alert
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class TournamentInfo extends Vue {
  get status() {
    return this.$tstore.getters.tournamentStatus;
  }

  get shortMonthYear() {
    const date = new Date(this.$tstore.getters.nextLaunchTime ?? 0);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
}
</script>

<style lang="scss" scoped></style>
