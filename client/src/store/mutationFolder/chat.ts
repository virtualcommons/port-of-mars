import { ChatMessageData } from 'shared/types';

export default {
    ADD_TO_CHAT(state: any, payload: ChatMessageData) {
        state.chat.push(payload);
      },
}