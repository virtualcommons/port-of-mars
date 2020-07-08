import {Room, Client} from 'colyseus.js'

export function requestJoinOptions(this: Client, i: number) {
  return {username: `user${i}`};
}

export function onJoin(this: Room<any>) {
  console.log(this.sessionId, "joined");

  setInterval(() => {
    console.log('setting readiness');
    this.send('set-player-readiness', true)
  }, 1000);
}

export function onLeave(this: Room<any>) {
  console.log(this.sessionId, "left");
}

export function onError(this: Room, err: Error) {
  console.error(this.sessionId, "errored", err);
}
