<template>
  <div class="c-chat-mars-log container">
    <div class="button-switchers row">
      <div class="chat col-4">
        <button
          @click="switchCurrentView(view.Chat)"
          :class="buttonClass(view.Chat)"
        >
          Chat
        </button>
      </div>
      <div class="mars-log col-4">
        <button
          @click="switchCurrentView(view.MarsLog)"
          :class="buttonClass(view.MarsLog)"
        >
          Mars Log
        </button>
      </div>
      <div class="split col-4">
        <button
          @click="switchCurrentView(view.Split)"
          :class="buttonClass(view.Split)"
        >
          Split
        </button>
      </div>
    </div>
    <div
      v-if="currentView === view.MarsLog || currentView === view.Split"
      class="mars-log-view row tour-log-popup"
    >
      <MarsLog />
    </div>
    <div
      v-if="currentView === view.Chat || currentView === view.Split"
      class="chat-view row tour-chat"
    >
      <Chat />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import Chat from '@port-of-mars/client/components/game/static/chat/Chat.vue';
import MarsLog from '@port-of-mars/client/components/game/MarsLog.vue';
import { ChatMarsLogView } from '@port-of-mars/client/types/panes.ts';
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

  private buttonClass(buttonViewOption: ChatMarsLogView) {
    return buttonViewOption === this.currentView ? 'selected' : '';
  }

  private switchCurrentView(view: ChatMarsLogView) {
    this.api.setChatMarsLogView(view);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/ChatMarsLog.scss';
</style>
