<template>
  <b-row class="h-100 w-100" no-gutters>
    <b-col cols="7">
      <div id="rooms" class="h-100 content-container mr-3">
        <div
          v-if="roomNotFound"
          class="h-100 d-flex flex-column justify-content-center align-items-center"
        >
          <div class="text-center">
            <h4 class="mb-4">Room Not Found</h4>
            <b-button variant="outline-secondary" :to="lobby">
              <b-icon-arrow-left shift-v="3"></b-icon-arrow-left> Return to lobby
            </b-button>
          </div>
        </div>
        <b-table
          dark
          sticky-header
          v-else
          class="h-100 m-0 custom-table"
          style="max-height: none"
          :fields="clientFields"
          :items="clients"
        >
          <template #cell(username)="data">
            <b-icon-person-fill></b-icon-person-fill> {{ data.item.username }}
          </template>
          <template #cell(ready)="data">
            <b-badge v-if="isLeader(data.item.username)" variant="primary" class="float-right">
              Room leader
            </b-badge>
            <b-badge v-else-if="data.item.ready" variant="success" class="float-right">
              Ready to start with bots
            </b-badge>
            <b-badge v-else variant="warning" class="float-right">
              Waiting for more players
            </b-badge>
          </template>
          <template #head(ready)>
            <b-button size="sm" variant="outline-secondary" class="float-right py-0" :to="lobby">
              <b-icon-arrow-left shift-v="3"></b-icon-arrow-left> Return to lobby
            </b-button>
          </template>
          ></b-table
        >
      </div>
    </b-col>
    <b-col cols="5">
      <div id="actions" v-if="!roomNotFound" class="h-100 pl-3 d-flex flex-column">
        <span v-if="starting">
          <p>
            <b-spinner small label="Loading..."></b-spinner>
            A game will begin shortly, have fun!
          </p>
        </span>
        <span v-else>
          <p>A game will launch as soon as the room fills up with 5 players.</p>
        </span>
        <b-button
          v-if="isLeader($tstore.state.user.username)"
          size="lg"
          variant="success"
          class="w-100 mb-3"
          @click="api.startWithBots()"
          ><h4>Start with {{ potentialBots }}</h4></b-button
        >
        <span v-else>
          <b-button
            v-if="!playerReadiness"
            size="lg"
            variant="success"
            class="w-100 mb-3"
            @click="api.voteStartWithBots(true)"
            ><h4>Vote to start with bots</h4></b-button
          >
          <b-button
            v-else
            size="lg"
            variant="warning"
            class="w-100 mb-3"
            @click="api.voteStartWithBots(false)"
            ><h4>Wait for more players</h4></b-button
          >
        </span>
        <b-form-group
          label="Invite a friend by sharing this link."
          label-for="share-url"
          class="mb-3"
        >
          <b-form-input id="share-url" :value="shareUrl" class="mb-1" readonly></b-form-input>
          <b-button v-if="!shareUrlCopied" variant="outline-secondary" @click="copyShareUrl">
            <b-icon-clipboard shift-v="3"></b-icon-clipboard> Copy
          </b-button>
          <b-button v-else variant="success" @click="copyShareUrl">
            <b-icon-clipboard-check shift-v="3"></b-icon-clipboard-check> Copied
          </b-button>
        </b-form-group>
        <h4 class="mt-3">Room Chat</h4>
        <div class="flex-grow-1 content-container">
          <LobbyChat :messages="chatMessages"></LobbyChat>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { LobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { applyLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { LOBBY_PAGE } from "@port-of-mars/shared/routes";
import LobbyChat from "@port-of-mars/client/components/lobby/LobbyChat.vue";

@Component({
  components: {
    LobbyChat,
  },
})
export default class LobbyRoom extends Vue {
  @Inject() readonly $client!: Client;
  @Inject() readonly api!: LobbyRequestAPI;
  @Prop() id!: string;

  lobby = { name: LOBBY_PAGE };

  clientFields = [
    { key: "username", label: "Player" },
    { key: "ready", label: "" },
  ];
  shareUrlCopied = false;
  roomNotFound = false;

  get shareUrl() {
    return window.location.href;
  }

  get clients() {
    return this.$tstore.state.lobby.clients;
  }

  get chatMessages() {
    return this.$tstore.state.lobby.chat;
  }

  get starting() {
    return this.$tstore.state.lobby.ready;
  }

  get playerReadiness() {
    return this.$tstore.getters.lobbyPlayerReadiness;
  }

  get potentialBots() {
    const numBots = 5 - this.clients.length;
    return `${numBots} ${numBots === 1 ? "bot" : "bots"}`;
  }

  chat: any[] = [];

  isLeader(username: string) {
    return this.clients[0]?.username === username;
  }

  async copyShareUrl() {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.shareUrlCopied = true;
      setTimeout(() => {
        this.shareUrlCopied = false;
      }, 3 * 1000);
    } catch (e) {
      console.log("Failed to copy share url to clipboard.");
    }
  }

  async created() {
    // if client is was not connected to this room (e.g. user navigated to this page directly),
    // join the room for the client
    if (!this.api.room) {
      try {
        const room = await this.$client.joinById(this.id);
        applyLobbyResponses(room, this);
        this.api.connect(room);
      } catch (e) {
        this.roomNotFound = true;
      }
    }
  }

  beforeDestroy() {
    this.api.leave();
    this.$tstore.commit("RESET_LOBBY_STATE", {});
  }
}
</script>

<style lang="scss" scoped>
#share-url {
  background-color: $light-shade-10;
}
</style>
