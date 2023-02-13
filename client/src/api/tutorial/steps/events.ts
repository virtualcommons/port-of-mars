import { Step, RIGHT } from "@port-of-mars/client/types/tutorial";
import { Phase, RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-phase",
    content: `Mars is unpredictable; many different events can happen!`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_SYSTEM_HEALTH: 75,
        SET_GAME_PHASE: Phase.events,
        SET_INVESTMENT_COSTS: {
          data: {
            culture: Number.MAX_SAFE_INTEGER,
            finance: Number.MAX_SAFE_INTEGER,
            government: 3,
            legacy: 3,
            science: 2,
            systemHealth: 1,
          },
          role: RESEARCHER,
        },
      },
      {
        // FIXME: this should be pulling its data from MarsEvents, which I suppose makes a case for keeping them in shared instead?
        ADD_TO_EVENTS: {
          id: "changingTides",
          name: "Changing Tides",
          effect: `Each player discards all their Accomplishment cards and draws 1 new
          Accomplishment card. (They still draw up to a total of three cards at the end
          of this round.)`,
          flavorText: `Create contingencies for your contingencies and contingencies for
          those contingencies. Then prepare to improvise.`,
          clientViewHandler: "NO_CHANGE" as const,
          duration: 1,
        },
      },
    ],
  },
  {
    target: ".tour-event",
    content: `As System Health decreases, you may encounter more than 1 event.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [],
  },
];

export default steps;
