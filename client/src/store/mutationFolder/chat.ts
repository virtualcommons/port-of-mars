<<<<<<< HEAD
import {ChatMessageData} from 'shared/types';
import * as _ from 'lodash';
import {State} from "@/store/state";

export default {
  ADD_TO_CHAT(state: State, payload: ChatMessageData) {
    state.chat.push(payload);
  },
  REMOVE_FROM_CHAT(state: State, message: ChatMessageData) {
    const index = _.findIndex(state.chat, (m: ChatMessageData) => m.dateCreated === message.dateCreated);
    state.chat.splice(index, 1);
  }
};
=======
import { ChatMessageData } from 'shared/types';

export default {
    ADD_TO_CHAT(state: any, payload: ChatMessageData) {
        state.chat.push(payload);
      },
}
>>>>>>> [refactor] store is modular
