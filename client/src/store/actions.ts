import { ChatMessage } from '../models';

export default {
  updatePhase(context: any, payload:string) {
    context.commit('SET_GAME_PHASE', payload);
  },
  updateRoundEvents(context: any, payload:any) {
    context.commit('SET_EVENTS_FOR_ROUND', payload);
  },
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
  setActiveAccomplishments(context: any, payload: any) {
    context.commit('SET_ACTIVE_ACCOMPLISHMENTS', payload);
  },
  setTradingView(context: any, payload: any) {
    context.commit('SET_TRADING_VIEW', payload);
  },
  setTradingMember(context: any, payload: any) {
    context.commit('SET_TRADING_MEMBER', payload);
  },
  changeUpkeepAmount(context: any, payload: number) {
    context.commit('CHANGE_UPKEEP_AMOUNT', payload);
  },
  setNotificationMessage(context: any, payload: string) {
    context.commit('SET_NOTIFICATION_MESSAGE', payload);
  },
  setNotificationStatus(context: any, payload: string) {
    context.commit('SET_NOTIFICATION_STATUS', payload);
  },
  addToMarsLog(context: any, payload: string) {
    context.commit('ADD_TO_MARS_LOG', payload);
  },
  setCardModalData(context: any, payload: object) {
    context.commit('SET_CARD_MODAL_DATA', payload);
  },
};
