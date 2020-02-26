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
import ModalContainer from '@/components/gamedashboard/global/modals/ModalContainer.vue';
import ContainerBoard from '@/components/gamedashboard/global/containers/ContainerBoard.vue';
import GameDashboard from '@/components/GameDashboard.vue';

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

  @Provide()
  api: GameRequestAPI = new GameRequestAPI();

  hasApi: boolean = false;

  async created() {
    const jwt = this.$ajax.loginCreds?.token;

    if (!jwt) {
      this.$ajax.forgetLoginCreds();
      await this.$router.push({ name: 'Login' });
      return;
    }

    if (!this.$tstore.state.user.passedQuiz) {
      await this.$router.push({ name: 'Tutorial' });
      return;
    }

    const gameRoom = await this.$client.joinOrCreate('game', {
      token: jwt
    });
    applyGameServerResponses(gameRoom, this.$tstore);
    this.api.connect(gameRoom);
    this.hasApi = true;
    this.$store.commit('SET_LAYOUT', 'game');
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
