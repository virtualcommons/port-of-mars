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
    if (45 < this.setWidth && this.setWidth <= 69) {
      return 'statusbar-inner-yellow';
    }

    if (this.setWidth <= 45) {
      return 'statusbar-inner-red';
    }
    return this.colorInner;
  }
}
</script>

<style lang="css" scoped>
.statusbar-outer {
  height: 1rem !important;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.statusbar-inner {
  height: 0.5rem !important;
  margin: 0.125rem;
  margin-right: 0.125rem;
  margin-left: 0.125rem;
  border-radius: 0.25rem;
  transition: all 0.4s ease-in-out;
}

.statusbar-outer-white {
  border: 0.125rem solid var(--space-white-opaque-2);
}

.statusbar-outer-gray {
  border: 0.125rem solid var(--space-gray);
}

.statusbar-inner-white {
  background-color: var(--space-white);
}

.statusbar-inner-gray {
  background-color: var(--space-gray);
}

.statusbar-inner-green {
  background-color: var(--status-green);
}

.statusbar-inner-yellow {
  background-color: var(--status-yellow);
}

.statusbar-inner-red {
  background-color: var(--status-red);
}
</style>
