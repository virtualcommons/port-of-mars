import { ChatMessageData } from 'shared/types';
import * as _ from 'lodash';

export default {
  ADD_TO_CHAT(state: any, payload: ChatMessageData) {
    state.chat.push(payload);
  },
  REMOVE_FROM_CHAT(state: any, message: ChatMessageData) {
    const index = _.findIndex(
      state.chat,
      (m: ChatMessageData) => m.dateCreated === message.dateCreated
    );
    state.chat.splice(index, 1);
  }
};
