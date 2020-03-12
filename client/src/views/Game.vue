<template>
  <div class="default-layout">
    <GameDashboard />
  </div>
</template>

<script lang="ts">
import {Vue, Component, Inject, Provide, Prop} from 'vue-property-decorator';
import { Client } from 'colyseus.js';
import { applyGameServerResponses } from '@/api/game/response';
import { GameRequestAPI } from '@/api/game/request';
import { EnvironmentMode } from '@/settings';
import ModalContainer from '@/components/gamedashboard/global/modals/ModalContainer.vue';
import ContainerBoard from '@/components/gamedashboard/global/containers/ContainerBoard.vue';
import GameDashboard from '@/components/GameDashboard.vue';
import _ from "lodash";

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
    const rooms = await this.$client.getAvailableRooms('game');
    for (const room of rooms) {
      console.log({room});
    }
    const gameRoom = await this.$client.consumeSeatReservation(this.$ajax.reservation);
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
@import '@/stylesheets/layouts/DefaultLayout.scss';
</style>
