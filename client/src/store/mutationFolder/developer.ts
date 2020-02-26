import { State } from '@/store/state';

function TOGGLE_IN_DEVELOPMENT(state: State, payload: boolean) {
  state.inDevelopment = payload;
}

function TOGGLE_DEV_TOOLS(state: State, payload: boolean) {
  state.devToolsEnabled = payload;
}

export default {
  TOGGLE_IN_DEVELOPMENT,
  TOGGLE_DEV_TOOLS
};
