<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Inject, InjectReactive, Vue } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class Master extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  // mars log message object
  private logMessage: object = {
    performedBy: this.$tstore.state.role,
    category: 'test',
    content: 'TEST LOG MESSAGE',
    timestamp: new Date().getTime()
  };

  // notification string
  private notification: string = 'TEST NOTIFICATION';

  // server message object
  private serverMessage: object = {
    text: 'TEST SERVER MESSAGE'
  };

 /**
   * Gets keydown after Vue instance is mounted.
   * 
   */  
  mounted() {
    document.onkeydown = this.onKeyDown;
  }

  /**
    * Reset keydown to null right before Vue instance is destroyed.
    * 
    */
  beforeDestroy() {
    if (document && document.onkeydown) document.onkeydown = null;
  }

  /**
    * Map keystrokes to commands linked to game functionality.
    * @param e Event that is triggered by keystroke.
    * r : go to next phase
    * q : reset game
    * . : toggle loading
    * m : generate Mars Log message
    * n : generate notification message
    * ] : generates server message
    * 
    */
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
