import { ChatMessage } from '@/models';

export default {

  SET_ACCS(state: any, payload: any) {
    // payload is an array of numbers
    // for all the numbers
    // activecards.push(Data(number))
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
};
