<template>
  <div></div>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import Synthetic from '../tutorial/syntheticdata';
import { MarsLogMessage, BaseInvestmentCosts } from '@/models';
import {GameRequestAPI} from "@/api/gameAPI/request";

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
      const dataPackage = {
            performedBy:this.$store.state.role,
            category:'justforfun',
            content:'just a fun little reminder!',
            timestamp: new Date().getTime()
          }
      this.$store.commit('ADD_TO_MARS_LOG',dataPackage)
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
