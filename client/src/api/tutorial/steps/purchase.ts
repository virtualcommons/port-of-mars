import { Step, TOP, LEFT, RIGHT } from "@port-of-mars/client/types/tutorial";
import { Phase, RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-purchase",
    content: `Now that we have invested and traded, it's time to purchase Accomplishments.`,
    params: {
      placement: RIGHT
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.purchase,
        SET_INVESTMENT_COSTS: {
          data: {
            culture: Number.MAX_SAFE_INTEGER,
            finance: Number.MAX_SAFE_INTEGER,
            government: 3,
            legacy: 3,
            science: 2,
            systemHealth: 1
          },
          role: RESEARCHER
        },
        SET_INVENTORY: {
          data: {
            culture: 10,
            finance: 10,
            government: 0,
            legacy: 10,
            science: 10,
            systemHealth: 0
          },
          role: "Researcher"
        }
      }
    ]
  },
  {
    target: ".tour-purchase-action",
    content: `Accomplishments that you can purchase have an orange header and are moved to the top.
        Try purchasing one now!`,
    params: {
      placement: TOP
    },
    stateTransform: [
      {
        required: true
      }
    ]
  },
  {
    target: ".tour-ready-to-advance-button",
    content: `Click the Ready to Advance button when you are done purchasing Accomplishments. `,
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        SET_LAYOUT: "tutorial",
        // SET_VICTORY_POINTS: {
        //   data: 3,
        //   role: 'Researcher',
        // },
        required: true
      }
    ]
  }
];

export default steps;
