<template>
<!--  d-flex: transform b-container into flex-item -->
<!--  flex-column: set vertical direction on flex-items -->
  <b-container fluid class="h-100 px-2 d-flex flex-column tour-split-chat-log">
    <!-- h-auto: auto sets height + gives row a height -->
    <!-- ** must give a height in order for flex-grow-1 to work below -->
    <b-row class="h-auto w-100 p-0 mt-2 justify-content-center">
      <!-- buttons: toggle chat | mars log | split -->
      <b-col cols="4" class="p-0">
        <button
          @click="switchCurrentView(view.Chat)"
          :class="buttonClass(view.Chat)"
        >
          Chat
        </button>
      </b-col>
      <b-col cols="4" class="p-0 m-0">
        <button
          @click="switchCurrentView(view.MarsLog)"
          :class="buttonClass(view.MarsLog)"
        >
          Mars Log
        </button>
      </b-col>
      <b-col cols="4" class="p-0 m-0">
        <button
          @click="switchCurrentView(view.Split)"
          :class="buttonClass(view.Split)"
        >
          Split
        </button>
      </b-col>
    </b-row>
    <!-- flex-grow-1: tells this row to grow as needed to fill the remainder -->
    <!-- height of b-container -->
    <!-- flex-column: set vertical direction (cols stack on top consecutively -->
    <b-row class="flex-grow-1 flex-column p-0 w-100 justify-content-center"
    >
      <b-col v-show="currentView === view.MarsLog || currentView === view.Split"
             class="w-100 mt-2 tour-log-view overflow-hidden"
             style="border: 0.125rem solid #A49CA6"
      >
        <MarsLog />
      </b-col>
      <b-col v-show="currentView === view.Chat || currentView === view.Split"
             class="w-100 mt-2 tour-chat overflow-hidden"
             style="border: 0.125rem solid #A49CA6"
      >
        <Chat />
      </b-col>
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

  private buttonClass(buttonViewOption: ChatMarsLogView) {
    return buttonViewOption === this.currentView ? 'selected' : '';
  }

  private switchCurrentView(view: ChatMarsLogView) {
    this.api.setChatMarsLogView(view);
  }
}
</script>

<style lang="scss" scoped>
button {
  @include reset-button;
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 0;
  border-radius: 0;
  font-size: $font-med;
  font-weight: $bold !important;
  text-align: center;
  color: $dark-accent;
  border: 0.125rem solid $dark-accent;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;

  &:disabled {
    opacity: 0.5;
  }

  &.selected {
    color: $dark-shade;
    background-color: $dark-accent;
  }
}
</style>
