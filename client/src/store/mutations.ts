import { ChatMessage } from '../models';

export default {
  SET_ACCS(state: any, payload: any) {
    // payload is an array of numbers
    // for all the numbers
    // activecards.push(Data(number))
  },
  SET_GAME_PHASE(state: any, payload:string) {
    state.gamePhase = payload;
  },
  SET_EVENTS_FOR_ROUND(state:any, payload:any) {
    state.gameEvents = payload;
    // console.log(state.gameEvents);
  },
  ADD_TO_CHAT(state: any, payload: ChatMessage) {
    state.chat.addEntry(payload);
  },
  CHANGE_LOCAL_INVESTMENT(state: any, payload: any) {
    // this is for increment and decrement

    state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
  },
  CHANGE_LOCAL_ROUND_COSTS(state: any, payload: any) {
    Object.keys(payload).forEach((key) => {
      state.localInvestments.updateCurrentCost(key, payload[key]);
    });
    // for (const investment in payload) {
    //   // console.log(investment,payload[investment]);
    //   state.localInvestments.updateCurrentCost(investment, payload[investment]);
    // }
  },
  SET_PLAYER_ROLE(state: any, payload: any) {
    state.playerRole = payload;
  },
  SET_ACTIVE_ACCOMPLISHMENTS(state:any, payload:any) {
    state.activeAccomplishmentCards = payload;
    // console.log(state.activeAccomplishmentCards);
  },
  /**
   * SET_LAYOUT() mutation
   * Changes the state of the layout state.
   * @param state The state of the application.
   * @param payload The string value of layout.
   *
   */
  SET_LAYOUT(state: any, newLayout: string) {
    state.layout = newLayout;
  },
  SET_TRADING_VIEW(state: any, newTradingView: string) {
    state.tradingView = newTradingView;
  },
  SET_TRADING_MEMBER(state: any, newTradingMember: string) {
    state.tradingMember = newTradingMember;
  },
  CHANGE_UPKEEP_AMOUNT(state: any, payload: number) {
    if (state.upkeep - payload >= 0) {
      state.upkeep -= payload;
    }
  },
  SET_NOTIFICATION_MESSAGE(state: any, payload: string) {
    state.notifMessage = payload;
  },
  SET_NOTIFICATION_STATUS(state: any, payload: string) {
    state.notifIsActive = payload;
  },
  ADD_TO_MARS_LOG(state: any, payload: string) {
    state.marsLog.push(payload);
  },
  SET_CARD_MODAL_DATA(state: any, payload: object) {
    state.cardData = payload;
  },
};
