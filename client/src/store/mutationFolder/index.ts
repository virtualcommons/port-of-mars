import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import layout from './layout';
import notifications from './notifications';
import player from './player'
import trading from './trading';
import quiz from './quiz';

export default {
  SET_LAYOUT(state: any, newLayout: string) {
    state.layout = newLayout;
  },

  ...accomplishments,
  ...chat,
  ...gameState,
  ...investment,
  ...layout,
  ...notifications,
  ...player,
  ...trading,
  ...quiz,
};
