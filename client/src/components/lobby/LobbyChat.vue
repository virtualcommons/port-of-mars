<template>
  <div id="chat" class="h-100 d-flex flex-column">
    <div id="messages" class="flex-grow-1 d-flex flex-column-reverse justify-content-start p-2">
      <div
        v-for="msg in reversedMessages"
        :key="msg.username + msg.dateCreated"
        class="mt-2 backdrop rounded p-1"
      >
        <p class="mb-0 text-break">
          <b class="text-light">{{ msg.username }}: </b>
          <span class="text-secondary">{{ msg.message }}</span>
        </p>
      </div>
    </div>
    <p class="m-3" v-if="showConductWarning">
      Chat messages may be recorded. Please adhere to the
      <b
        ><a
          target="_blank"
          href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct"
        >
          Port of Mars Code of Conduct
        </a></b
      >
    </p>
    <div id="input" class="flex-shrink-1">
      <b-form @submit.stop.prevent="submitToChat" class="p-2" inline>
        <b-form-input
          v-model="pendingMessage"
          :placeholder="isMuted ? 'You are currently muted' : 'Send a message'"
          autocomplete="off"
          class="flex-grow-1 mr-2"
          @keyup.enter="submitToChat"
          :disabled="isMuted"
        ></b-form-input>
        <b-button variant="secondary" type="submit" title="Send message" :disabled="isMuted">
          <b-icon-cursor></b-icon-cursor>
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue } from "vue-property-decorator";
import { LobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { LobbyChatMessageData } from "@port-of-mars/shared/types";

@Component({})
export default class LobbyChat extends Vue {
  @Inject() readonly api!: LobbyRequestAPI;
  @Prop() messages!: Array<LobbyChatMessageData>;

  pendingMessage: string = "";
  showConductWarning = true;

  get reversedMessages(): Array<LobbyChatMessageData> {
    return this.messages.slice().reverse();
  }

  get isMuted() {
    return this.$tstore.state.user.isMuted;
  }

  updated() {
    const el = this.$el.querySelector("#messages");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  get pendingMessageCleaned(): string {
    return this.pendingMessage.trim().replace(/(\n)/gm, " ");
  }

  async submitToChat() {
    this.showConductWarning = false;
    if (this.pendingMessageCleaned && this.pendingMessageCleaned !== "") {
      await this.api.sendChatMessage(this.pendingMessageCleaned);
      this.pendingMessage = "";
    }
  }
}
</script>

<style lang="scss" scoped>
#messages {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100px;
}
</style>
