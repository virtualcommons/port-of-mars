import { ChatMessage } from '@/models';

export default {
  sendChatMsg(context, message: ChatMessage) {
    context.commit('ADD_TO_CHAT', message);
  },
  changeLocalInvestment(context, payload) {
    context.commit('CHANGE_LOCAL_INVESTMENT', payload);
  },
  updateRoundCosts(context, payload) {
    context.commit('CHANGE_LOCAL_ROUND_COSTS', payload);
  },
  setPlayerRole(context, payload) {
    context.commit('SET_PLAYER_ROLE', payload);
  },
};
