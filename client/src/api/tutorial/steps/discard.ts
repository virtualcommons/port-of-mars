import { Step, TOP, RIGHT, LEFT } from '@port-of-mars/client/types/tutorial';
import { Phase } from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content:
      `The last phase in a round is Discard! You can ` +
      `draw new Accomplishments to replace any Accomplishments ` +
      `you don't want to keep during the next round.`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.discard,
        SET_ACTIVE_ACCOMPLISHMENTS: {
          data: {
            id: 6,
            role: 'Researcher',
            label: 'Accomplishment you cannot currently purchase',
            flavorText: 'Dummy Accomplishment that you should throw away!',
            science: 3,
            government: 1,
            legacy: 0,
            finance: 0,
            culture: 0,
            upkeep: 0,
            victoryPoints: 1,
            effect: 'none',
          },
          role: 'Researcher',
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
    content: `Click the Ready to Advance button when you have finished discarding. `,
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
