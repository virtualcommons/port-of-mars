import { Client, Room } from "colyseus.js";
import { DataChange, Schema } from "@colyseus/schema";
import { MultiplayerLiteGameClientState } from "@port-of-mars/shared/lite";

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

export function applyMultiplayerGameServerResponses(room: Room, component: any, client: Client) {
  // const store = component.$tstore;
  // const router = component.$router;
  room.onError((code: number, message?: string) => {
    console.log(`Error ${code} occurred in room: ${message} `);
    alert("sorry, we encountered an error, please try refreshing the page or contact us");
  });

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
  });

  function applyChanges(target: any, changes: DataChange[], fields: string[]) {
    changes.forEach(change => {
      if (fields.includes(change.field)) {
        target[change.field] = change.value;
      }
    });
  }

  room.state.onChange = (changes: DataChange[]) => {
    applyChanges(component.state, changes, [
      "type",
      "round",
      "timeRemaining",
      "systemHealth",
      "activeCardId",
      "canInvest",
      "isRoundTransitioning",
      "status",
      "numPlayers",
      "maxRound",
      "twoEventsThreshold",
      "threeEventsThreshold",
    ]);
  };

  room.state.visibleEventCards.onAdd = (eventCard: any, key: number) => {
    component.state.visibleEventCards.push(deschemify(eventCard));
  };

  room.state.visibleEventCards.onRemove = (eventCard: any, key: number) => {
    component.state.visibleEventCards.shift();
  };

  room.state.players.onAdd = (player: any, userId: string) => {
    const p = deschemify(player);
    // if p is the 'self' player, set the state.player (match by username)
    if (p.username === client.auth.username) {
      component.state.player = p;
    }
    component.state.players.set(userId, p);
  };
  room.state.players.onChange = room.state.players.onAdd; // same as onAdd

  room.state.players.onRemove = (player: any, userId: string) => {
    const p = deschemify(player);
    // if p is the 'self' player, reset the state.player
    if (p.username === client.auth.username) {
      component.state.player = {
        resources: 0,
        points: 0,
      };
    }
    component.state.players.delete(userId);
  };
}

export const DEFAULT_STATE: MultiplayerLiteGameClientState = {
  type: "prolific",
  status: "incomplete",
  timeRemaining: 0,
  systemHealth: 0,
  round: 0,
  player: {
    resources: 0,
    points: 0,
  },
  players: new Map(),
  numPlayers: 1,
  maxRound: 8,
  twoEventsThreshold: 50,
  threeEventsThreshold: 25,
  visibleEventCards: [],
  activeCardId: -1,
  canInvest: false,
  isRoundTransitioning: false,
};
