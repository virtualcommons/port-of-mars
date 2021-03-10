<template>
  <!-- display chat if chat is available -->
  <!--  d-flex: transform b-container into flex-item -->
  <!--  flex-column: set vertical direction on flex-items -->
  <b-container v-if="isChatAvailable" class="d-flex flex-column h-100 m-0 p-0" fluid>
    <!-- flex-grow-1: tells this row to grow as needed to fill the remainder -->
    <!-- height of b-container -->
    <b-row class="w-100 flex-grow-1 m-auto scroll-to-recent"
           style="overflow-y: auto; overflow-x: hidden;"
           @click="focusChatInput"
    >
      <!-- b-row wrapper to achieve chat scroll effect -->
      <b-row class="w-100 my-2 justify-content-center" align-content="end">
        <!-- if there is no chat history to display -->
        <p v-if="messages.length === 0" style="color: rgba(241, 224, 197, 0.25)">
          No Messages
        </p>
        <!-- chat message -->
        <b-row
          v-for="message in messages"
          :key="message.dateCreated"
          :style="getMessageColor(message)"
          class="h-auto w-100 my-1 flex-column justify-content-start"
          style="color: rgb(241, 224, 197); background-color: rgba(241, 224, 197, 0.05);
                font-size: 1rem;"
        >
          <b-col align-self="end">
            <!-- role of sender (e.g. Curator) -->
            <p class="mb-0 mx-2 mt-2 text-uppercase" style=" color: rgb(202, 166, 110);
               font-weight: bold">
              {{ message.role }}
            </p>
            <!-- message of sender -->
            <p class="mx-2" style="word-wrap: break-word">
              {{ message.message }}
            </p>
            <!-- timestamp -->
            <p class="mb-2 mx-2">[ {{ toDate(message.dateCreated) }} ]</p>
          </b-col>
        </b-row>
      </b-row>
    </b-row>
    <!-- flex-shrink-1: tells this row to shrink as needed to make room for other flex-items
    within the height constraints of b-container -->
    <b-row class="w-100 h-auto align-items-center flex-shrink-1 my-2 mx-auto">
      <b-col cols="10" class="w-100">
        <b-form-input
          ref="chatInputRef"
          class="h-100 flex-grow-1"
          style="color: rgb(241, 224, 197); background-color: transparent; font-size: 1rem;"
          @keydown.enter="submitToChat"
          v-model="pendingMessage"
          placeholder="Send a message"
        />
      </b-col>
      <b-col cols="2" class="w-100 m-0 p-0">
        <b-button icon v-b-tooltip.hover="'Send chat message'" @click="submitToChat">
          <font-awesome-icon
            :icon="['far', 'paper-plane']"
            :class="sendBtnClass"
            size="lg"
            style="color: rgb(241, 224, 197)"
          />
        </b-button>
      </b-col>
    </b-row>
  </b-container>
  <!-- disable chat if chat is not available -->
  <b-row v-else class="h-100 w-100 m-0 p-0 justify-content-center align-items-center">
      <p class="m-0 p-0 text-center" style="color: var(--dark-accent); font-weight: bold;
         font-size: 1rem;">
        Chat is disabled this round.
      </p>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ChatMessageData } from '@port-of-mars/shared/types';

library.add(faPaperPlane);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class Chat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  pendingMessage: string = '';

  focusChatInput() {
    if (this.isChatAvailable) {
      console.log('focus chat');
      (<any>this.$refs.chatInputRef).focus()
    }
  }

  get pendingMessageCleaned(): string {
    // TODO: CAN ADD MORE CLEANING AS NECESSARY
    return this.pendingMessage.trim();
  }

  get sendBtnClass(): string {
    return this.pendingMessageCleaned.length === 0
      ? 'chat-input-sendbtn'
      : 'chat-input-sendbtn--ready';
  }

  get isChatAvailable(): any {
    return this.$store.getters.isChatAvailable;
  }

  get messages(): any {
    return this.$tstore.state.messages;
  }

  updated() {
    if (this.isChatAvailable) {
      const elem = this.$el.querySelector('.scroll-to-recent');
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  toDate(unixTimestamp: number): any {
    return new Date(unixTimestamp).toLocaleTimeString();
  }

  submitToChat(): void {
    if (this.pendingMessageCleaned && this.pendingMessageCleaned !== '') {
      this.api.sendChatMessage(this.pendingMessageCleaned);
      this.pendingMessage = '';
    }
  }

  getMessageColor(message: ChatMessageData): object {
    if (message.role) {
      return { backgroundColor: `var(--color-${message.role})` };
    }
    return { backgroundColor: 'var(--light-shade-05)' };
  }
}
</script>

<style lang="scss" scoped>
.chat-input-sendbtn {
  margin: 0 0.5rem;
  color: $light-accent-25;
  @include default-transition-base;
  cursor: pointer;

  &--ready {
    @extend .chat-input-sendbtn;
    color: $light-accent;
    @include default-scale-up;
  }
}
</style>
