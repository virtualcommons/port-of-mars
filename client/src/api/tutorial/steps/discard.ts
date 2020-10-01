import { Step, TOP, RIGHT, LEFT } from '@port-of-mars/client/types/tutorial';
import {Phase, RESEARCHER} from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `The last phase in a round is Discard. You can discard any Accomplishments you don't want to keep ` +
      `and draw up to three new Accomplishments at the beginning of the next round.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.discard,
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
      },
    ],
  },
  {
    target: '.tour-discard-action',
    content: `Try discarding an Accomplishment!`,
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
    content: `Click the Ready to Advance button after you have discarded the Accomplishment. `,
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
