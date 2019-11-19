<template>
  <div class="round">
    <p>Round <span class="round-number">{{ roundNumber }}</span></p>
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

<style scoped>
.round {
  width: 100%;
  font-size: var(--font-large);
  color: var(--space-white);
}

.round p {
  margin-bottom: 1rem;
  display: inline-block;
  text-align: left;
  border-bottom: 0.125rem solid var(--space-orange);
}
</style>
