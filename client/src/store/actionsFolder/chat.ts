import { ChatMessage } from '@/models';

export default {
  sendChatMsg(context: any, message: ChatMessage) {
    context.commit('ADD_TO_CHAT', message);
  }
};
