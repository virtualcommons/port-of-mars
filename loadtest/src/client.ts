import {Room, Client} from 'colyseus.js'
import {GameData} from "@port-of-mars/shared/types";
import {initialStoreState} from "@port-of-mars/shared/game/client/state";
import _ from "lodash";

let state: GameData = _.cloneDeep(initialStoreState);

export function requestJoinOptions(this: Client, i: number) {
  return {[i]: 'request to join'};
}

export function onJoin(this: Room<GameData>) {
  console.log(this.sessionId, "joined");
}

export function onLeave(this: Room<GameData>) {
  console.log(this.sessionId, "left");
}

export function onError(this: Room, err: Error) {
  console.error(this.sessionId, "errored", err);
}

export function onStateChange(this: Room, newState: GameData) {
  state = newState;
  console.log(state);
}
