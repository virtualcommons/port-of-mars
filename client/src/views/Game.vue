<template>
  <div class="default-layout">
    <GameDashboard />
  </div>
</template>

<script lang="ts">
import {Vue, Component, Inject, Provide, Prop} from 'vue-property-decorator';
import { Client } from 'colyseus.js';
import { applyGameServerResponses } from '@port-of-mars/client/api/game/response';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { EnvironmentMode } from '@port-of-mars/client/settings';
import ModalContainer from '@port-of-mars/client/components/gamedashboard/global/modals/ModalContainer.vue';
import ContainerBoard from '@port-of-mars/client/components/gamedashboard/global/containers/ContainerBoard.vue';
import GameDashboard from '@port-of-mars/client/components/GameDashboard.vue';
import _ from "lodash";
import {LOBBY_PAGE} from "shared/routes";

@Component({
  name: 'game',
  components: {
    GameDashboard,
    ModalContainer,
    ContainerBoard
  }
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: GameRequestAPI = new GameRequestAPI();
  private hasApi: boolean = false;
  private env: EnvironmentMode = new EnvironmentMode;

  async created() {
    this.api.room?.leave();
    let gameRoom: Room;
    if (this.$ajax.reservation) {
      gameRoom = await this.$client.consumeSeatReservation(this.$ajax.reservation);
    } else if (this.$ajax.gameConnInfo) {
      gameRoom = await this.$client.reconnect(this.$ajax.gameConnInfo.roomId, this.$ajax.gameConnInfo.sessionId);
    } else {
      console.log('an error occured');
      return;
    }
    applyGameServerResponses(gameRoom, this.$tstore);
    this.api.connect(gameRoom);
    this.hasApi = true;
    this.$store.commit('SET_LAYOUT', 'game');
    this.$store.commit('SET_ENVIRONMENT', this.env.environment);
  }

  destroyed() {
    console.log('leaving game');
    if (this.api.room) this.api.room.leave();
    this.$tstore.commit('RESET_STATE', {});
  }
}
</script>

<style lang="scss">
@import '@port-of-mars/client/stylesheets/layouts/DefaultLayout.scss';
</style>
