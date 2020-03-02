import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import layout from './layout';
import notifications from './notifications';
import player from './player';
import trading from './trading';
import lobby from './lobby';

export default {
  SET_LAYOUT(state: any, newLayout: string) {
    state.layout = newLayout;
  },

  SET_ENVIRONMENT(state: any, newEnvironment: string) {
    state.environment = newEnvironment;
  },

  ...accomplishments,
  ...chat,
  ...gameState,
  ...investment,
  ...layout,
  ...notifications,
  ...player,
  ...trading,
  ...lobby,
};
