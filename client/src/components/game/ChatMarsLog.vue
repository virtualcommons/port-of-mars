<template>
  <b-container fluid class="h-100 m-0 p-0">
    <!--  flex-column: set vertical direction on flex-items -->
    <b-row class="h-100 flex-column p-0">
      <h4>Mars Log</h4>
      <b-col class="tour-chat overflow-hidden" style="border: 0.125rem solid #A49CA6">
        <MarsLog></MarsLog
      ></b-col>
      <div class="w-100 my-2"></div>
      <h4>Chat</h4>
      <b-col class="tour-chat overflow-hidden" style="border: 0.125rem solid #A49CA6">
        <Chat></Chat>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import Chat from "@port-of-mars/client/components/game/static/chat/Chat.vue";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import { ChatMarsLogView } from "@port-of-mars/shared/game/client/panes";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({
  components: {
    Chat,
    MarsLog
  }
})
export default class ChatMarsLog extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get currentView() {
    return this.$tstore.state.userInterface.chatMarsLogView;
  }

  get view() {
    return ChatMarsLogView;
  }
}
</script>
