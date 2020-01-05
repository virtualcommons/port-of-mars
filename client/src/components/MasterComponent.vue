<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/gameAPI/request';

@Component({})
export default class Master extends Vue {
  @Inject() readonly $api!: GameRequestAPI;

  onKeyDown(e: any) {
    if (e.key === 'r') {
      this.$api.setNextPhase();
    } else if (e.key === ',') {
      this.$root.$emit('openEvent');
    } else if (e.key === '.') {
      this.$root.$emit('closeEvent');
    } else if (e.key === 'q') {
      this.$api.resetGame();
    } else if (e.key === 'm') {
      const dataPackage = {
        performedBy: this.$store.state.role,
        category: 'justforfun',
        content: 'just a fun little reminder!',
        timestamp: new Date().getTime()
      };
      this.$store.commit('ADD_TO_MARS_LOG', dataPackage);
    } else if (e.key === 'n') {
      // this.$store.commit(
      //   'CREATE_NOTIFICATION',
      //   'this is just a little reminder that it will be alright!'
      // );
    } else if (e.key === ']') {
      this.$root.$emit('openModalServer', {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vestibulum.'
      });
    } else if (e.key === '[') {
      this.$root.$emit('openModalConfirmation', {
        text: `Select 'Yes' if you want to draw another card.`,
        type: 'discardAccomplishment',
        actionData: 3
      });
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
