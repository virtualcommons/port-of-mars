<template>
  <div></div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import { MarsLogMessage } from '@/models';
import {RequestAPI} from "@/api/request";

@Component({})
export default class Master extends Vue {
  @Inject()
  readonly $api!: RequestAPI;

  onKeyDown(e: any) {
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
