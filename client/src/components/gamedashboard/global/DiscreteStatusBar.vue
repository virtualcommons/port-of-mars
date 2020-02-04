<template>
  <div class="status-o">
    <div class="progress" v-for="n in timeBlockTotal" :key="n" />
    <div
      class="fader"
      :style="{ width: `${100 - (100 / timeBlockTotal) * usedTimeBlocks}%` }"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class DiscreteStatusBar extends Vue {
  @Prop({ default: 0 }) private usedTimeBlocks!: number;

  get timeBlockTotal() {
    return this.$store.getters.player.timeBlocks;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/StatusBarDiscrete.scss';
</style>
