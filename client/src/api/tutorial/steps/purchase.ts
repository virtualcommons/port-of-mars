import { Step, TOP, RIGHT, LEFT } from '@port-of-mars/client/types/tutorial';
import {Phase, RESEARCHER} from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content:
      `Now that we have invested our time blocks and traded Influence Resources, it's
      finally time to purchase some Accomplishments!`,
    params: {
      placement: RIGHT,
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
          role: RESEARCHER,
        },
        SET_INVENTORY: {
          data: {
            culture: 10,
            finance: 10,
            government: 0,
            legacy: 10,
            science: 10,
            systemHealth: 0,
          },
          role: 'Researcher',
        },
      },
    ],
  },
  {
    target: '.tour-inventory',
    content: `You can view your current inventory of Influence Resources here.`,
    params: {
      placement: RIGHT,
    },
  },
  {
    target: '.tour-purchase-action',
    content: `Accomplishments that you can purchase have an orange header and are moved to the top.
        Try purchasing one now!`,
    params: {
      placement: TOP,
    },
    stateTransform: [
      {
        required: true,
      },
    ],
  },
  {
    target: '.tour-ready-to-advance-button',
    content: `Click the Ready to Advance button when you are done purchasing Accomplishments. `,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      {
        SET_LAYOUT: 'tutorial',
        required: true,
      },
    ],
  },
];

export default steps;
