<template>
  <b-container fluid class="h-100 m-0 p-0">
    <!--  flex-column: set vertical direction on flex-items -->
    <b-row class="h-100 flex-column p-0 justify-content-center">
      <h2 class="text-center">Chat Messages</h2>
      <b-col class="flex-grow-1 mt-2 tour-chat overflow-hidden" style="border: 0.125rem solid #A49CA6">
        <Chat />
      </b-col>
      <b-button
        v-b-modal.modal-center
        block
        squared
        class="mt-2 tour-log"
        variant="outline-secondary"
        style="border: 0.125rem solid"
      >
        <p class="my-auto"><b>Show Mars Log</b></p>
      </b-button>
      <b-modal
        id="modal-center"
        scrollable
        centered
        header-bg-variant="dark"
        body-bg-variant="dark"
        footer-bg-variant="dark"
      >
        <MarsLog></MarsLog>
      </b-modal>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import Chat from '@port-of-mars/client/components/game/static/chat/Chat.vue';
import MarsLog from '@port-of-mars/client/components/game/MarsLog.vue';
import { ChatMarsLogView } from '@port-of-mars/shared/game/client/panes';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({
  components: {
    Chat,
    MarsLog,
  },
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
