import { ChatMessageData } from 'shared/types';
import { BaseInvestmentCosts, GetAccomplishmentsByPerson, buyAccomplishment } from "@/models";

export default {
  SET_ACCS(state: any, payload: any) {
    // payload is an array of numbers
    // for all the numbers
    // activecards.push(Data(number))
  },
  /**
   * SET_LAYOUT() mutation
   * Changes the state of the layout state.
   * @param state The state of the application.
   * @param payload The string value of layout.
   *
   */

  // game updates
  SET_GAME_PHASE(state: any, payload: string) {
    state.gamePhase = payload;
    if (payload === 'Upkeep') {
      state.round += 1;
    }
    if (payload === 'Trading') {
      state.localInvestments.confirmInvestments();
    }
  },
  SET_EVENTS_FOR_ROUND(state: any, payload: any) {
    state.gameEvents = payload;
    // console.log(state.gameEvents);
  },
  CHANGE_UPKEEP_AMOUNT(state: any, payload: number) {
    if (state.upkeep - payload >= 0) {
      state.upkeep -= payload;
    }
  },
  ADD_TO_CHAT(state: any, payload: ChatMessageData) {
    state.chat.push(payload);
  },
  CHANGE_LOCAL_INVESTMENT(state: any, payload: any) {
    // this is for increment and decrement

    state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
  },
  SET_CARD_MODAL_DATA(state: any, payload: object) {
    state.cardData = payload;
  },
  SET_PLAYER_ROLE(state: any, payload: string) {
    state.playerRole = payload;
    
    Object.keys(BaseInvestmentCosts[payload]).forEach((key) => {
      state.localInvestments.updateCurrentCost(key, BaseInvestmentCosts[payload][key]);
    });

    //state.activeAccomplishmentCards = GetAccomplishmentsByPerson(payload,3);
  },
  SET_PLAYER_FINISHED(state: any, payload: boolean) {
    state.playerFinishedWithPhase = payload;
  },

  // accomplishments
  SET_ACTIVE_ACCOMPLISHMENTS(state: any, payload: any) {
    //state.activeAccomplishmentCards = payload;
    state.activeAccomplishmentCards = GetAccomplishmentsByPerson(state.playerRole,payload);
  },
  PURCHASE_ACCOMPLISHMENT(state:any, payload:any){
    let bought = state.localInvestments.purchaseAccomplishment(payload.cost);
    if(bought){
      buyAccomplishment(payload.title);
    }
  },
  /**
   * SET_LAYOUT() mutation
   * Changes the state of the layout state.
   * @param state The state of the application.
   * @param newLayout The string value of layout.
   *
   */
  SET_LAYOUT(state: any, newLayout: string) {
    state.layout = newLayout;
  },

  // trading
  SET_TRADING_VIEW(state: any, newTradingView: string) {
    state.tradingView = newTradingView;
  },
  SET_TRADING_MEMBER(state: any, newTradingMember: string) {
    state.tradingMember = newTradingMember;
  },

  // notifications
  SET_NOTIFICATION_MESSAGE(state: any, payload: string) {
    state.notifMessage = payload;
  },
  SET_NOTIFICATION_STATUS(state: any, payload: string) {
    state.notifIsActive = payload;
  },
  SET_TIME_REMAINING(state: any, payload: number) {
    state.timeRemaining = payload;
  },
  ADD_TO_MARS_LOG(state: any, payload: string) {
    // correct location for this?
    // if (payload !== '') {
    //   state.marsLog.push(payload);
    // }
    state.marsLog.addEntry(payload);
  },
  // CHANGE_LOCAL_ROUND_COSTS(state: any, payload: any) {
  //   Object.keys(payload).forEach(key => {
  //     state.localInvestments.updateCurrentCost(key, payload[key]);
  //   });
  // }
};
