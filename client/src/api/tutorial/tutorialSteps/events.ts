import { Step, TOP, RIGHT, LEFT, BOTTOM } from "@port-of-mars/client/types/tutorial";
import { Phase } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-phase",
    content: `The first phase in a round is the Events phase! This is where the Events of the round will be revealed.`,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.events,
        ADD_TO_EVENTS: {
          id: "changingTides",
          name: "Changing Tides",
          effect: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
          flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
          clientViewHandler: "NO_CHANGE" as const,
          duration: 1
        }
      }
    ]
  },
  {
    target: ".tour-active-events",
    content:
      `Some Events can be more involved and require players to fulfill tasks ` +
      `that include voting. Mars is unpredictable; many different events can happen!`,
    params: {
      placement: RIGHT
    }
  },
  {
    target: ".tour-system-health",
    content: `Keep in mind that as System Health drops, the number of Events you will encounter will increase.`,
    params: {
      placement: BOTTOM
    }
  },
  {
    target: ".tour-event-deck",
    content:
      `Events persisting multiple rounds or relevant to the current round will be shown here.`,
    params: {
      placement: RIGHT
    }
  },
  {
    target: ".tour-event-popup",
    content:
      `Thoughout the game, you can also access active events by clicking here.`,
    params: {
      placement: TOP
    },
    stateTransform: [
      {
        SET_LAYOUT: `tutorial`,
        // required: true,
      }
    ]
  }
];

export default steps;
