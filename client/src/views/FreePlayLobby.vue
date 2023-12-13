<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <Messages class="p-3"></Messages>
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-5" style="max-width: 1400px">
        <b-col cols="4">
          <HelpPanel></HelpPanel>
        </b-col>
        <b-col cols="8">
          <router-view
            @createRoom="createRoom"
            @joinRoom="joinRoom"
            @startSoloWithBots="startSoloWithBots"
          ></router-view>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Provide, Inject, Vue } from "vue-property-decorator";
import { Client, Room } from "colyseus.js";
import { applyLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { FreePlayLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { AccountAPI } from "@port-of-mars/client/api/account/request";
import { FREE_PLAY_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { GAME_PAGE, CONSENT_PAGE, MANUAL_PAGE } from "@port-of-mars/shared/routes";
import { Constants } from "@port-of-mars/shared/settings";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";

@Component({
  components: {
    Countdown,
    HelpPanel,
    Messages,
  },
})
export default class FreePlayLobby extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() api: FreePlayLobbyRequestAPI = new FreePlayLobbyRequestAPI(this.$ajax);
  accountApi!: AccountAPI;

  game = { name: GAME_PAGE };
  manual = { name: MANUAL_PAGE };
  consent = { name: CONSENT_PAGE };

  get constants() {
    return Constants;
  }

  async created() {
    this.accountApi = new AccountAPI(this.$store, this.$ajax);
    await this.checkCanPlay();
    const hasActiveGame = await this.api.hasActiveGame("freeplay");
    if (hasActiveGame) {
      this.$router.push(this.game);
    }
  }

  async checkCanPlay() {
    const data = await this.accountApi.authenticate();
    if (data) {
      if (!data.isVerified || !data.dateConsented) {
        this.$router.push(this.consent);
      }
    }
  }

  async createRoom() {
    const room = await this.$client.create(FREE_PLAY_LOBBY_NAME);
    await this.connectAndRedirect(room);
  }

  async joinRoom(roomId: string) {
    const room = await this.$client.joinById(roomId);
    await this.connectAndRedirect(room);
  }

  async startSoloWithBots() {
    await this.createRoom();
    this.api.startSoloWithBots();
  }

  async connectAndRedirect(room: Room) {
    this.$router.push({ name: "FreePlayLobbyRoom", params: { id: room.id } });
    applyLobbyResponses(room, this, "freeplay");
    this.api.connect(room);
  }
}
</script>

<style lang="scss" scoped></style>
