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
  readonly $api!: GameRequestAPI;

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
    if(e.key === 'm'){
      this.$store.commit('ADD_TO_MARS_LOG',{category:'just fun',message:'this is just for fun!'})
    }
    if(e.key=='n'){
      this.$store.commit('CREATE_NOTIFICATION','this is just a little reminder that it will be alright!');
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
