import { Room } from "colyseus.js";
import { DataChange, Schema } from "@colyseus/schema";
import { SetHiddenParams } from "@port-of-mars/shared/sologame";

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

export function applySoloGameServerResponses(room: Room, component: any) {
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

  room.state.player.onChange = (changes: DataChange[]) => {
    applyChanges(component.state.player, changes, ["points", "resources"]);
  };

  room.state.treatmentParams.onChange = (changes: DataChange[]) => {
    applyChanges(component.state.treatmentParams, changes, [
      "isKnownNumberOfRounds",
      "isEventDeckKnown",
      "thresholdInformation",
    ]);
  };

  room.state.onChange = (changes: DataChange[]) => {
    applyChanges(component.state, changes, [
      "round",
      "timeRemaining",
      "systemHealth",
      "activeRoundCardIndex",
      "canInvest",
      "isRoundTransitioning",
      "status",
    ]);
  };

  room.state.roundEventCards.onAdd = (eventCard: any, key: number) => {
    component.state.roundEventCards.push(deschemify(eventCard));
  };

  room.state.roundEventCards.onRemove = (eventCard: any, key: number) => {
    component.state.roundEventCards.shift();
  };

  room.onMessage("set-hidden-params", (msg: SetHiddenParams) => {
    component.state = { ...component.state, ...msg.data };
  });
}
