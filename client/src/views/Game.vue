<template>
  <div class="default-layout">
    <GameDashboard />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from 'vue-property-decorator';
import { Client } from 'colyseus.js';
import { applyGameServerResponses } from '@/api/game/response';
import { GameRequestAPI } from '@/api/game/request';
import MasterComponent from '@/components/MasterComponent.vue';
import ModalContainer from '@/components/gamedashboard/global/modals/ModalContainer.vue';
import ContainerBoard from '@/components/gamedashboard/global/containers/ContainerBoard.vue';
import GameDashboard from '@/components/GameDashboard.vue';

@Component({
  name: 'game',
  components: {
    GameDashboard,
    MasterComponent,
    ModalContainer,
    ContainerBoard
  }
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;

  @Provide()
  api: GameRequestAPI = new GameRequestAPI();

  hasApi: boolean = false;

  async created() {
    if (!this.$tstore.state.user.passedQuiz) {
      await this.$router.push({ name: 'Tutorial' });
      return;
    }

    const gameRoom = await this.$client.joinOrCreate('game', {
      token: localStorage.getItem('jwt')
    });
    applyGameServerResponses(gameRoom, this.$tstore);
    this.api.connect(gameRoom);
    this.hasApi = true;
  }

  destroyed() {
    console.log('leaving game');
    if (this.api.room) {
      this.api.room.leave();
    }
  }
}
</script>

<style lang="scss">
@import '@/stylesheets/layouts/DefaultLayout.scss';
</style>
