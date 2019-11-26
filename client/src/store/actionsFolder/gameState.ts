export default {
  updatePhase(context: any, payload: string) {
    context.commit('SET_GAME_PHASE', payload);
  },
  changeUpkeepAmount(context: any, payload: number) {
    context.commit('CHANGE_UPKEEP_AMOUNT', payload);
  },
  setPlayerRole(context: any, payload: any) {
    context.commit('SET_PLAYER_ROLE', payload);
  }
};
