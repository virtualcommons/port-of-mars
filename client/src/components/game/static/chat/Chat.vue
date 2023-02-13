<template>
  <!-- display chat if chat is available -->
  <!--  d-flex: transform b-container into flex-item -->
  <!--  flex-column: set vertical direction on flex-items -->
  <b-container v-if="isChatAvailable" class="d-flex flex-column h-100 m-0 p-0" fluid>
    <!-- flex-grow-1: tells this row to grow as needed to fill the remainder -->
    <!-- height of b-container -->
    <b-row
      class="w-100 flex-grow-1 m-auto scroll-to-recent"
      style="overflow-y: auto; overflow-x: hidden"
      @click="focusChatInput"
    >
      <!-- b-row wrapper to achieve chat scroll effect -->
      <b-row class="w-100 justify-content-center" align-content="end">
        <!-- if there is no chat history to display -->
        <p
          v-if="readOnly && messages.length === 0"
          class="m-5"
          style="color: rgba(241, 224, 197, 0.25)"
        >
          No chat history to display.
        </p>
        <p class="ml-4" v-if="!readOnly && messages.length === 0">
          Chat is recorded. Please adhere to the
          <b
            ><a
              target="_blank"
              href="https://github.com/virtualcommons/port-of-mars/wiki/Port-of-Mars-Chat-Code-of-Conduct"
            >
              Port of Mars Code of Conduct
            </a> </b
          >. You cannot send private messages to other members in your group.
        </p>
        <!-- chat message -->
        <ChatMessage
          v-for="message in messages"
          :key="message.dateCreated"
          :message="message"
          :showUsername="false"
        >
          <!-- report button slot -->
          <!-- TODO: hide report button on server-generated audit chat messages -->
          <ReportButton v-if="reportable" :message="message" :showUsername="false"></ReportButton>
        </ChatMessage>
      </b-row>
    </b-row>
    <!-- flex-shrink-1: tells this row to shrink as needed to make room for other flex-items
    within the height constraints of b-container -->
    <b-row v-if="!readOnly" class="w-100 h-auto align-items-center flex-shrink-1 my-2 mx-auto">
      <b-col class="w-100 px-0">
        <b-form-textarea
          no-resize
          rows="2"
          :readonly="isMuted"
          ref="chatInputRef"
          class="h-100 flex-grow-1 backdrop"
          style="color: rgb(241, 224, 197); font-size: 1rem; padding-right: 2rem"
          @keydown.enter="submitToChat"
          v-model="pendingMessage"
          :placeholder="
            isMuted ? 'You are currently muted' : 'Type and press enter to send a message'
          "
        ></b-form-textarea>
        <b-button
          variant="link"
          size="lg"
          style="
            position: relative;
            float: right;
            bottom: 50px;
            margin-bottom: -50px;
            padding: 0.5rem;
            color: var(--light);
          "
          :disabled="isMuted"
          v-b-tooltip.hover="'Send chat message'"
          @click="submitToChat"
        >
          <b-icon-cursor></b-icon-cursor>
        </b-button>
      </b-col>
    </b-row>
  </b-container>
  <!-- disable chat if chat is not available -->
  <b-row v-else class="h-100 w-100 m-0 p-0 justify-content-center align-items-center">
    <p
      class="m-0 p-0 text-center"
      style="color: var(--dark-accent); font-weight: bold; font-size: 1rem"
    >
      Chat is disabled this round.
    </p>
  </b-row>
</template>

<script lang="ts">
import { Vue, Prop, Component, Inject } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";
import ReportButton from "@port-of-mars/client/components/game/static/chat/ReportButton.vue";

@Component({
  components: {
    ChatMessage,
    ReportButton,
  },
})
export default class Chat extends Vue {
  @Inject({ default: null }) readonly api!: GameRequestAPI;

  @Prop({ default: false })
  readOnly!: boolean;

  @Prop({ default: true })
  reportable!: boolean;

  @Prop()
  messages!: any;

  pendingMessage: string = "";

  focusChatInput() {
    if (this.isChatAvailable && !this.readOnly) {
      (this.$refs.chatInputRef as any).focus();
    }
  }

  get pendingMessageCleaned(): string {
    return this.pendingMessage.trim().replace(/(\n)/gm, " ");
  }

  get isChatAvailable(): any {
    return this.$store.getters.isChatAvailable;
  }

  get isMuted() {
    return this.$store.getters.player.isMuted;
  }

  updated() {
    if (this.isChatAvailable) {
      // FIXME: this would be more efficient as an id lookup, not a css class lookup
      const elem = this.$el.querySelector(".scroll-to-recent");
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  async submitToChat() {
    if (this.pendingMessageCleaned && this.pendingMessageCleaned !== "") {
      await this.api.sendChatMessage(this.pendingMessageCleaned);
      this.pendingMessage = "";
    }
  }
}
</script>

<style lang="scss" scoped></style>
