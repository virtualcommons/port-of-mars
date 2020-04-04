<template>
  <div class="w-100 h-100">
    <LoadingScreen v-if="!gameIsReady" />
    <GameDashboard v-else-if="gameIsReady" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from 'vue-property-decorator';
import GameDashboard from '@port-of-mars/client/components/GameDashboard.vue';
import LoadingScreen from '@port-of-mars/client/components/global/LoadingScreen.vue';
import { Client, Room } from 'colyseus.js';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { applyGameServerResponses } from '@port-of-mars/client/api/game/response';
import { EnvironmentMode } from '@port-of-mars/client/settings';

@Component({
  name: 'game',
  components: {
    GameDashboard,
    LoadingScreen,
  },
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() api: GameRequestAPI = new GameRequestAPI();
  private env: EnvironmentMode = new EnvironmentMode();
  private gameIsReady: boolean = false;
  private encounteredError: boolean = false;
  private errorMessage: string = '';

  async created() {
    this.api.room?.leave();
    let gameRoom: Room;

    if (this.$ajax.reservation) {
      gameRoom = await this.$client.consumeSeatReservation(
        this.$ajax.reservation
      );
    } else if (this.$ajax.gameConnectionInfo) {
      gameRoom = await this.$client.reconnect(
        this.$ajax.gameConnectionInfo.roomId,
        this.$ajax.gameConnectionInfo.sessionId
      );
    } else {
      this.gameIsReady = false;
      this.encounteredError = true;
      this.errorMessage = 'Error joining game room.';
      return;
    }

    applyGameServerResponses(gameRoom, this.$tstore);
    this.api.connect(gameRoom);
    this.$store.commit('SET_LAYOUT', 'game');
    this.$store.commit('SET_ENVIRONMENT', this.env.environment);
    this.gameIsReady = true;
    this.encounteredError = false;
    this.errorMessage = '';
  }

  destroyed() {
    if (this.api.room) this.api.room.leave();
    this.$tstore.commit('RESET_STATE', {});
  }
}
</script>

<style lang="scss"></style>
