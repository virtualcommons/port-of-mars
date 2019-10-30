import { ChatMessage } from '@/models';

export default {
  sendChatMsg(context: any, message: ChatMessage) {
    context.commit('ADD_TO_CHAT', message);
  },
  changeLocalInvestment(context: any, payload: any) {
    context.commit('CHANGE_LOCAL_INVESTMENT', payload);
  },
  updateRoundCosts(context: any, payload: any) {
    context.commit('CHANGE_LOCAL_ROUND_COSTS', payload);
  },
  setPlayerRole(context: any, payload: any) {
    context.commit('SET_PLAYER_ROLE', payload);
  },
};
