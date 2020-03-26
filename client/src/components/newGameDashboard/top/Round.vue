<template>
  <div class="round tour-round">
    <p>
      Round <span>{{ roundNumber }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Round extends Vue {
  get roundNumber() {
    const { round, upkeep } = this.$store.state;
    if (round > 0 && upkeep > 0) {
      return round;
    }

    if (upkeep <= 0) {
      return 'Over';
    }

    return 'Pregame';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/Round.scss';
</style>
