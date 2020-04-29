<template>
  <div class="default-layout">
    <GameDashboard />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide, Prop } from "vue-property-decorator";
import { Client, Room } from "colyseus.js";
import { applyGameServerResponses } from "@port-of-mars/client/api/game/response";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { EnvironmentMode } from "@port-of-mars/client/settings";
import GameDashboard from "@port-of-mars/client/components/GameDashboard.vue";
import _ from "lodash";
import { LOBBY_PAGE } from "@port-of-mars/shared/routes";
import { url } from "@port-of-mars/client/util";
import { AjaxResponseError } from "@port-of-mars/client/plugins/ajax";
import { LOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";

@Component({
  name: "game",
  components: {
    GameDashboard
  }
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: GameRequestAPI = new GameRequestAPI();
  private hasApi: boolean = false;
  private env: EnvironmentMode = new EnvironmentMode();



  async created() {
    this.api.room?.leave();
    let gameRoom: Room;
    let cachedRoomId = this.$ajax.roomId;
    let roomId: string = '';
    console.log({ cachedRoomId });
    if (!cachedRoomId) {
      try {
        await this.$ajax.get(url("/game/latest-active"), ({data, status}) => {
          roomId = data;
        });
      }
      catch (e) {
        this.$tstore.commit('SET_DASHBOARD_MESSAGE', e.data);
      }
    } 
    else {
      roomId = cachedRoomId;
    }
    try {
      console.log({ roomId });
      if (roomId) {
        gameRoom = await this.$client.joinById(roomId);
        applyGameServerResponses(gameRoom, this.$tstore);
        this.api.connect(gameRoom, this.$tstore);
        this.hasApi = true;
        this.$tstore.commit("SET_LAYOUT", "game");
        // FIXME: remove SET_ENVIRONMENT entirely in a later refactor
        // this.$tstore.commit("SET_ENVIRONMENT", this.env.environment);
      }
    }
    catch (e) {
      console.error(e);
      this.$tstore.commit('SET_DASHBOARD_MESSAGE', { kind: 'danger', message: e.message });
      this.$router.push({ name: DASHBOARD_PAGE });
    }
  }

  destroyed() {
    if (this.api.room) this.api.room.leave();
    this.$tstore.commit("RESET_STATE", {});
  }
}
</script>

<style lang="scss">
@import "@port-of-mars/client/stylesheets/layouts/DefaultLayout.scss";
</style>
