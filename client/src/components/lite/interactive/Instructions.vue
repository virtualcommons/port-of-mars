<template>
  <span class="text-left">
    <h4 class="mb-3">Recap of the rules of the game</h4>
    <p>
      You have a maximum of <strong>12 rounds</strong> of investing and reacting to Mars Events with
      the goal of achieving Points that will earn you money (bonus payout) while keeping the
      community alive by maintaining System Health. If System Health reaches zero, all players die,
      and no Points are earned.
    </p>
    <p>
      In each round, you will usually receive <strong>10 time blocks</strong> that you can invest in
      System Health or keep them as Points.
    </p>
    <p>
      The initial amount of System Health is <strong>45 units</strong>, while the maximum level is
      <strong>60 units</strong>. Each round, System Health declines by <strong>15 units</strong> due
      to wear and tear.
    </p>
    <p>
      Each round, except round 1, Mars Events happen, with more events when System Health drops
      below <strong>39 units</strong> and <strong>21 units</strong>.
    </p>
    <p>You can chat with the other two players by writing messages throughout the game.</p>
    <b-alert v-if="treatmentText" show variant="success font-weight-bold">
      <b-icon-info-circle></b-icon-info-circle>
      {{ treatmentText }}
    </b-alert>
    <p>
      If you are disconnected for any reason during the study, you will be able to rejoin by
      returning to this page
      <a href="javascript:void(0)" @click="copyPageUrl" class="ml-2">
        <b-icon-clipboard v-if="!linkCopied"></b-icon-clipboard>
        <b-icon-check-circle-fill v-else></b-icon-check-circle-fill>
        copy link
      </a>
    </p>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Instructions extends Vue {
  @Prop() treatmentText?: string;

  linkCopied = false;

  async copyPageUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 3 * 1000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  }
}
</script>
