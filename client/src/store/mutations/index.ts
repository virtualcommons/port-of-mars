import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import layout from './layout';
import notifications from './notifications';
import player from './player';
import trading from './trading';
import ui from './ui';
import { State, getInitialStoreState } from '@port-of-mars/client/store/state';
import { ServerErrorMessage } from '@port-of-mars/shared/types';

export default {
  RESET_STATE(state: State, options?: any) {
    Object.assign(state, getInitialStoreState());
  },

  SET_LAYOUT(state: any, newLayout: string) {
    state.layout = newLayout;
  },

  SET_ERROR_MESSAGE(state: any, payload: ServerErrorMessage) {
    state.errors.push(payload);
  },

  DISMISS_ERROR_MESSAGE(state: any, index: number) {
    state.errors.splice(index, 1);
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
  ...ui,
};
