import { ChatMessageData } from '@port-of-mars/shared/types';
import * as _ from 'lodash';
import { State } from '@port-of-mars/client/store/state';

export default {
  ADD_TO_CHAT(state: State, payload: ChatMessageData) {
    state.messages.push(payload);
  },
  REMOVE_FROM_CHAT(state: State, message: ChatMessageData) {
    const index = _.findIndex(
      state.messages,
      (m: ChatMessageData) => m.dateCreated === message.dateCreated
    );
    state.messages.splice(index, 1);
  }
};
