<template>
  <div class="status-o">
    <div class="progress" v-for="n in totalTimeBlocks" :key="n" />
    <div
      class="fader"
      :style="{ width: `${100 - (100 / totalTimeBlocks) * usedTimeBlocks}%` }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class DiscreteStatusBar extends Vue {
  @Prop({ default: 0 }) private usedTimeBlocks!: number;
  @Prop({ default: 10 }) private totalTimeBlocks!: number;
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/investment/DiscreteStatusBar.scss';
</style>
