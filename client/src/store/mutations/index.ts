import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import layout from './layout';
import notifications from './notifications';
import player from './player';
import trading from './trading';
import ui from './ui';
import Vue from 'vue';
import { State, getInitialStoreState } from '@port-of-mars/client/store/state';
import { DashboardMessage } from '@port-of-mars/shared/types';
import _ from 'lodash';

export default {
  RESET_STATE(state: State, options?: any) {
    Object.assign(state, getInitialStoreState());
  },

  SET_LAYOUT(state: State, newLayout: string) {
    state.layout = newLayout;
  },

  SET_DASHBOARD_MESSAGE(state: State, payload: DashboardMessage) {
    if (! _.some(state.dashboardMessages, payload)) {
      state.dashboardMessages.push(payload);
    }
  },

  DISMISS_DASHBOARD_MESSAGE(state: State, message: string) {
    Vue.set(state, 'dashboardMessages', state.dashboardMessages.filter(dm => dm.message !== message));
  },

  SET_CONSENT(state: State, consent: boolean) {
    state.consent = consent;
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
