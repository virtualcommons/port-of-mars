import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import layout from './layout';
import notifications from './notifications';
import player from './player';
import roundIntroduction from './roundIntroduction';
import trading from './trading';
import ui from './ui';
import Vue from 'vue';
import { State, getInitialStoreState } from '@port-of-mars/shared/game/client/state';
import {DashboardMessage, Role, SystemHealthChangesData} from '@port-of-mars/shared/types';
import _ from 'lodash';

export default {
  RESET_STATE(state: State, options?: any) {
    Object.assign(state, getInitialStoreState());
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

  SET_SYSTEM_HEALTH_CHANGES(state: State, payload: {role: Role, data: SystemHealthChangesData}) {
    Vue.set(state.players[payload.role].systemHealthChanges, 'purchases', payload.data.purchases);
    state.players[payload.role].systemHealthChanges.investment = payload.data.investment;
  },

  ...accomplishments,
  ...chat,
  ...gameState,
  ...investment,
  ...layout,
  ...notifications,
  ...player,
  ...roundIntroduction,
  ...trading,
  ...ui,
};
