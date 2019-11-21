import { ChatMessage } from '../models';

export default {
  // game updates
  updatePhase(context: any, payload: string) {
    context.commit('SET_GAME_PHASE', payload);
  },
  updateRoundEvents(context: any, payload: any) {
    context.commit('SET_EVENTS_FOR_ROUND', payload);
  },
  changeUpkeepAmount(context: any, payload: number) {
    context.commit('CHANGE_UPKEEP_AMOUNT', payload);
  },
  setPlayerRole(context: any, payload: any) {
    context.commit('SET_PLAYER_ROLE', payload);
  },

  // chat
  sendChatMsg(context: any, message: ChatMessage) {
    context.commit('ADD_TO_CHAT', message);
  },

  // trading
  setTradingView(context: any, payload: any) {
    context.commit('SET_TRADING_VIEW', payload);
  },
  setTradingMember(context: any, payload: any) {
    context.commit('SET_TRADING_MEMBER', payload);
  },

  // notifcations
  setNotificationMessage(context: any, payload: string) {
    context.commit('SET_NOTIFICATION_MESSAGE', payload);
  },
  setNotificationStatus(context: any, payload: string) {
    context.commit('SET_NOTIFICATION_STATUS', payload);
  },
  addToMarsLog(context: any, payload: any) {
    context.commit('ADD_TO_MARS_LOG', payload);
  },

  // accomplishements
  setActiveAccomplishments(context: any, payload: any) {
    context.commit('SET_ACTIVE_ACCOMPLISHMENTS', payload);
  },
  purchaseAccomplishment(context:any, payload:any) {
    context.commit('PURCHASE_ACCOMPLISHMENT',payload);
  },

  // investments
  changeLocalInvestment(context: any, payload: any) {
    context.commit('CHANGE_LOCAL_INVESTMENT', payload);
  },
  // updateRoundCosts(context: any, payload: any) {
  //   context.commit('CHANGE_LOCAL_ROUND_COSTS', payload);
  // }
  // setPlayerFinished(context: any, payload: object) {
  //   context.commit('SET_PLAYER_FINISHED', payload);
  // },
};
