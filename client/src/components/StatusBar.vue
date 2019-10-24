<template>
  <div class="statusbar-outer" :class="styleOuter()">
    <div class="statusbar-inner" :class="styleInner()" :style="styleWidth()"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
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
    return this.colorInner;
  }
}
</script>

<style lang="css" scoped>
.statusbar-outer {
  display: flex;
  align-items: center;
  height: 1rem;
  flex-grow: 100;
  border-radius: 0.50rem;
}

.statusbar-outer-white {
  border: 0.125rem solid #F5F5F5;
}

.statusbar-outer-gray {
  border: 0.125rem solid #1E2223;
}

.statusbar-inner {
  height: 0.50rem;
  margin-left: 0.125rem;
  margin-right: 0.125rem;
  border-radius: 0.25rem;
}

.statusbar-inner-white {
  background-color: #F5F5F5;
}

.statusbar-inner-gray {
  background-color: #1E2223;
}
</style>
