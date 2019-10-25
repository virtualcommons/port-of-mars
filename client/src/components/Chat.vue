<template>
  <div class="chat">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <p class="chat-message" v-for="message in messages" :key="message">
        {{ message }}
      </p>
    </div>
    <div class="chat-input-frame">
      <input class="chat-input" type="text" @keydown.enter="submitToChat" v-model="message" />
      <button class="chat-input-sendbtn" type="button" @click="submitToChat">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Chat extends Vue {
  message: string = '';

  count: number = 0;

  // get messages() {
  //   return this.$store.state.chat;
  // }

  async submitToChat() {
    // await this.$store.dispatch("sendChatMsg", this.message);
    this.message = '';
  }
}
</script>

<style lang="css" scoped>
.chat {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
}

.chat-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #F5F5F5;
}

.chat-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 0.125rem solid #F5F5F5;
  border-bottom: none;
  overflow-y: auto;
}

.chat-message {
  color: #F5F5F5;
}

.chat-input-frame {
  height: 3rem;
  width: 100%;
  border: 0.125rem solid #F5F5F5;
  display: flex;
}

.chat-input {
  height: 100%;
  width: 80%;
  padding: 0.5rem;
  font-size: 1rem;
  color: #F5F5F5;
  border: none;
  background-color: #1E2223;
}

.chat-input:focus{
  outline: none;
}

.chat-input:active{
  outline: none;
}

.chat-input-sendbtn {
  height: 100%;
  width: 20%;
  border: none;
  font-size: 1rem;
  color: #C67B5C;
  background-color: #1E2223;
}

.chat-input-sendbtn:focus {
  outline: none;
}

.chat-input-sendbtn:active {
  outline: none;
}
</style>
