import { Room } from "colyseus.js";
import { DataChange, Schema } from "@colyseus/schema";
import { LiteGameClientState, SetHiddenParams } from "@port-of-mars/shared/lite";
import { ClientSafeUser } from "@port-of-mars/shared/types";

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

export function applyMultiplayerGameServerResponses(
  room: Room,
  component: any,
  user: ClientSafeUser
) {
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

  room.state.treatmentParams.onChange = (changes: DataChange[]) => {
    applyChanges(component.state.treatmentParams, changes, [
      "isNumberOfRoundsKnown",
      "isEventDeckKnown",
      "thresholdInformation",
      "isLowResSystemHealth",
      "instructions",
    ]);
  };

  room.state.onChange = (changes: DataChange[]) => {
    applyChanges(component.state, changes, [
      "type",
      "round",
      "timeRemaining",
      "eventTimeRemaining",
      "eventTimeTotal",
      "systemHealth",
      "activeCardId",
      "canInvest",
      "isRoundTransitioning",
      "status",
      "numPlayers",
      "isWaitingToStart",
      "chatEnabled",
      "votingInProgress",
      "currentVoteStep",
      "heroOrPariah",
    ]);
  };

  room.state.visibleEventCards.onAdd = (eventCard: any, key: number) => {
    component.state.visibleEventCards.push(deschemify(eventCard));
  };

  room.state.visibleEventCards.onRemove = (eventCard: any, key: number) => {
    component.state.visibleEventCards.shift();
  };

  room.onMessage("set-hidden-params", (msg: SetHiddenParams) => {
    component.state = { ...component.state, ...msg.data };
  });

  // Handle chat messages
  room.state.chatMessages.onAdd = (chatMessage: any) => {
    component.state.chatMessages.push(deschemify(chatMessage));
  };

  room.state.chatMessages.onRemove = (chatMessage: any, index: number) => {
    component.state.chatMessages.splice(index, 1);
  };

  room.state.players.onAdd = (player: any, userId: string) => {
    const p = deschemify(player);
    // if p is the 'self' player, set the state.player (match by username)
    if (userId === user.id.toString()) {
      component.state.player = p;
    }
    component.state.players.set(userId, p);

    // subscribe to changes in the player
    player.onChange = (changes: DataChange[]) => {
      const local = component.state.players.get(userId);
      for (const change of changes) {
        local[change.field] = change.value;
        if (userId === user.id.toString()) {
          component.state.player[change.field] = change.value;
        }
      }
    };

    // subscribe to vote changes if vote exists
    if (player.vote) {
      player.vote.onChange = () => {
        const local = component.state.players.get(userId);
        if (local) {
          local.vote = deschemify(player.vote);
          if (userId === user.id.toString()) {
            component.state.player.vote = deschemify(player.vote);
          }
        }
      };
    }
  };

  room.state.players.onRemove = (player: any, userId: string) => {
    // if p is the 'self' player, reset the state.player
    if (userId === user.id.toString()) {
      component.state.player = {
        resources: 0,
        points: 0,
      };
    }
    component.state.players.delete(userId);
  };
}

export const DEFAULT_STATE: LiteGameClientState = {
  type: "prolificBaseline",
  status: "incomplete",
  timeRemaining: 0,
  eventTimeRemaining: 0,
  eventTimeTotal: 0,
  systemHealth: 0,
  round: 0,
  treatmentParams: {
    isNumberOfRoundsKnown: false,
    isEventDeckKnown: false,
    thresholdInformation: "unknown",
    isLowResSystemHealth: false,
    instructions: "",
  },
  players: new Map(),
  numPlayers: 1,
  player: {
    username: "",
    role: "Curator",
    resources: 0,
    points: 0,
    pendingInvestment: null,
    hasInvested: false,
    pointsEarned: null,
    isReadyToStart: false,
  },
  visibleEventCards: [],
  activeCardId: -1,
  canInvest: false,
  isRoundTransitioning: false,
  isWaitingToStart: true,
  chatMessages: [],
  chatEnabled: false,
  votingInProgress: false,
  currentVoteStep: 0,
  heroOrPariah: "",
};
