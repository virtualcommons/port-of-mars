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

  room.state.player.onChange = (changes: DataChange[]) => {
    changes.forEach(change => {
      if (change.field === "points") {
        component.state.player.points = change.value;
      }
      if (change.field === "resources") {
        component.state.player.resources = change.value;
      }
    });
  };

  room.state.treatmentParams.onChange = (changes: DataChange[]) => {
    changes.forEach(change => {
      if (change.field === "isKnownNumberOfRounds") {
        component.state.treatmentParams.isKnownNumberOfRounds = change.value;
      }
      if (change.field === "isEventDeckKnown") {
        component.state.treatmentParams.isEventDeckKnown = change.value;
      }
      if (change.field === "thresholdInformation") {
        component.state.treatmentParams.thresholdInformation = change.value;
      }
    });
  };

  room.state.onChange = (changes: DataChange[]) => {
    changes.forEach(change => {
      if (change.field === "round") {
        component.state.round = change.value;
      }
      if (change.field === "timeRemaining") {
        component.state.timeRemaining = change.value;
      }
      if (change.field === "systemHealth") {
        component.state.systemHealth = change.value;
      }
      if (change.field === "activeRoundCardIndex") {
        component.state.activeRoundCardIndex = change.value;
      }
      if (change.field === "canInvest") {
        component.state.canInvest = change.value;
      }
    });
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
