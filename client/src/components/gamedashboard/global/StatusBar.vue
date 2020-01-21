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

  @Prop({ default: 'statusbar-inner-white' }) private colorStart!: string;

  @Prop({ default: 'statusbar-inner-yellow' }) private colorMiddle!: string;

  @Prop({ default: 'statusbar-inner-red' }) private colorEnd!:string;

  styleWidth(): object {
    return { width: `${this.setWidth}%` };
  }

  styleOuter(): string {
    return this.colorOuter;
  }

  styleInner(): string {
    if (34 < this.setWidth && this.setWidth <= 64) {
      return this.colorMiddle;
    }

    if (this.setWidth <= 34) {
      return this.colorEnd;
    }
    return this.colorStart;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/StatusBar.scss';
</style>
