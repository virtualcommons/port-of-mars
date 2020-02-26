<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Inject, InjectReactive, Vue } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class Master extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  private logMessage: object = {
    performedBy: this.$tstore.state.role,
    category: 'test',
    content: 'TEST LOG MESSAGE',
    timestamp: new Date().getTime()
  };

  private notification: string = 'TEST NOTIFICATION';

  private serverMessage: object = {
    text: 'TEST SERVER MESSAGE'
  };

  mounted() {
    document.onkeydown = this.onKeyDown;
  }

  beforeDestroy() {
    if (document && document.onkeydown) document.onkeydown = null;
  }

  onKeyDown(e: any) {
    switch (e.key) {
      case 'r':
        this.api.setNextPhase();
        break;
      case 'q':
        this.api.resetGame();
        break;
      case '.':
        this.$store.commit('TOGGLE_LOADING');
        break;
      case 'm':
        this.$store.commit('ADD_TO_MARS_LOG', this.logMessage);
        break;
      case 'n':
        this.$store.commit('CREATE_NOTIFICATION', this.notification);
        break;
      case ']':
        this.$root.$emit('openModalServer', this.serverMessage);
        break;
      default:
        break;
    }
  }
}
</script>
