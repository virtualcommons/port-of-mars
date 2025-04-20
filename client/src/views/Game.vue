<template>
  <b-container fluid class="h-100 p-0 m-0">
    <GameDashboard class="h-100 w-100 p-0 m-0"></GameDashboard>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from "vue-property-decorator";
import GameDashboard from "@port-of-mars/client/components/GameDashboard.vue";
import { Client, Room } from "colyseus.js";
import { applyGameServerResponses } from "@port-of-mars/client/api/pom/game/response";
import { GameRequestAPI } from "@port-of-mars/client/api/pom/game/request";
import { url } from "@port-of-mars/client/util";
import { FREE_PLAY_LOBBY_PAGE } from "@port-of-mars/shared/routes";
import { SfxManager } from "@port-of-mars/client/util";

@Component({
  name: "game",
  components: {
    GameDashboard,
  },
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;
  @Inject() readonly $sfx!: SfxManager;
  @Provide() private api: GameRequestAPI = new GameRequestAPI();
  hasApi: boolean = false;

  async created() {
    this.api.room?.leave();
    this.api.setSfxManager(this.$sfx);
    let gameRoom: Room;
    let cachedRoomId = this.$ajax.roomId;
    let roomId: string = "";
    console.log({ cachedRoomId });
    if (!cachedRoomId) {
      try {
        await this.$ajax.get(url("/game/latest-active"), ({ data }) => {
          roomId = data;
        });
      } catch (e) {
        if (e instanceof Error) {
          this.$tstore.commit("SET_DASHBOARD_MESSAGE", { kind: "danger", message: e.message });
        }
        console.error("Failed to get latest active game", e);
      }
    } else {
      roomId = cachedRoomId;
    }
    try {
      console.log({ roomId });
      if (roomId) {
        gameRoom = await this.$client.joinById(roomId);
        applyGameServerResponses(gameRoom, this.$tstore, this.$sfx);
        this.api.connect(gameRoom, this.$tstore);
        this.hasApi = true;
        this.$tstore.commit("SET_LAYOUT", "game");
      }
    } catch (e) {
      if (e instanceof Error) {
        this.$tstore.commit("SET_DASHBOARD_MESSAGE", {
          kind: "danger",
          message: e.message,
        });
      }
      console.error("Unable to join room: ", e);
      this.$router.push({ name: FREE_PLAY_LOBBY_PAGE });
    }
  }

  destroyed() {
    if (this.api.room) this.api.room.leave();
    this.$tstore.commit("RESET_GAME_STATE");
  }
}
</script>

<style lang="scss">
.game-layout {
  @include expand;
}
</style>
