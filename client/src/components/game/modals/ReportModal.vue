<template>
  <b-container fluid class="h-100">
    <p>Selected chat message:</p>
    <ChatMessage :message="message" :showUsername="showUsername"></ChatMessage>
    <div>
      <p>
        If you believe this message violates our
        <b-button variant="link" class="px-0" v-b-toggle="'coc-collapse'">
          code of conduct
        </b-button>
        please submit this report to our administrators.
      </p>
      <b-collapse id="coc-collapse" class="p-2 backdrop">
        <ul>
          <li>Abstain from personal attacks or harassment</li>
          <li>
            Abstain from using profanity or offensive language when communicating with your fellow
            participants
          </li>
          <li>Only communicate with other participants via the chat options within the game</li>
        </ul>
      </b-collapse>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import { ChatMessageData } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";

@Component({
  components: {
    ChatMessage,
  },
})
export default class ReportModal extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  @Prop() message!: ChatMessageData;
  @Prop({ default: false })
  showUsername!: boolean;
}
</script>

<style lang="scss" scoped>
ul {
  list-style: circle !important;
  padding-left: 2rem;
}
</style>
