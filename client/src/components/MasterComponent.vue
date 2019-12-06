<template>
  <div></div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import Synthetic from '../tutorial/syntheticdata';
import { MarsLogMessage, BaseInvestmentCosts } from '@/models';
import {RequestAPI} from "@/api/request";

@Component({})
export default class Master extends Vue {
  @Inject()
  readonly $api!: RequestAPI;

  private data = new Synthetic();

  private round: number = this.data.round;

  onKeyDown(e: any) {
    this.round = 0;
    if (e.key === 'r') {
      this.$api.setNextPhase();
    }
    if (e.key === ',') {
      this.$root.$emit('openEvent');
    }
    if (e.key === '.') {
      this.$root.$emit('closeEvent');
    }
    if (e.key === 'q') {
      this.$api.resetGame();
    }
  }

  mounted() {
    document.onkeydown = this.onKeyDown;

    this.$root.$on('nextRound', () => {
      this.phaseRunner();
    });
  }

  phaseRunner() {
    this.$api.setNextPhase();
  }
}
</script>
