<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <Messages class="p-3"></Messages>
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-5" style="max-width:1400px;">
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
import { DashboardAPI } from "@port-of-mars/client/api/dashboard/request";
import { applyLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { LobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { LOBBY_NAME } from "@port-of-mars/shared/lobby";
import {
  GAME_PAGE,
  REGISTER_PAGE,
  MANUAL_PAGE
} from "@port-of-mars/shared/routes";
import { Constants } from "@port-of-mars/shared/settings";
import { url } from "@port-of-mars/client/util";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import Messages from "@port-of-mars/client/components/dashboard/Messages.vue";

@Component({
  components: {
    Countdown,
    HelpPanel,
    Messages
  }
})
export default class Lobby extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() api: LobbyRequestAPI = new LobbyRequestAPI();

  game = { name: GAME_PAGE };
  manual = { name: MANUAL_PAGE };
  register = { name: REGISTER_PAGE };

  get constants() {
    return Constants;
  }

  async created() {
    await this.initPlayerData();
    await this.rejoinIfActiveGame();
  }

  async initPlayerData() {
    const dashboardAPI = new DashboardAPI(this.$tstore, this.$ajax);
    const data = await dashboardAPI.getData();
    if (data.playerTaskCompletion.mustVerifyEmail || data.playerTaskCompletion.mustConsent) {
      await this.$router.push(this.register);
      return;
    }
  }
  
  async rejoinIfActiveGame() {
    await this.$ajax.get(url("/game/has-active"), ({ data, status }) => {
      if (data) {
        this.$router.push(this.game);
      }
    });
  }

  async createRoom() {
    const room = await this.$client.create(LOBBY_NAME);
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
    this.$router.push({ name: "LobbyRoom", params: { id: room.id } });
    applyLobbyResponses(room, this);
    this.api.connect(room);
  }

}
</script>

<style lang="scss" scoped>
</style>
