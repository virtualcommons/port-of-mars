<template>
  <div class="statusbar-outer" :class="styleOuter()">
    <div class="statusbar-inner" :class="styleInner()" :style="styleWidth()"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class StatusBar extends Vue {
  @Prop({ default: 0 }) private setWidth!: number;

  @Prop({ default: 'statusbar-outer-white' }) private colorOuter!: string;

  @Prop({ default: 'statusbar-inner-white' }) private colorInner!: string;

  styleWidth(): object {
    return { width: `${this.setWidth}%` };
  }

  styleOuter(): string {
    return this.colorOuter;
  }

  styleInner(): string {
    if (34 < this.setWidth && this.setWidth <= 64) {
      return 'statusbar-inner-yellow';
    }

    if (this.setWidth <= 34) {
      return 'statusbar-inner-red';
    }
    return this.colorInner;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/StatusBar.scss';
</style>
