import { Step, TOP, RIGHT, LEFT } from '@port-of-mars/client/types/tutorial';
import { Phase } from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content:
      `Ok, so now we've invested our timeblocks and traded our Resources! It's ` +
      `finally time to purchase Accomplishments!`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.purchase,
        SET_INVENTORY: {
          data: {
            culture: 10,
            finance: 10,
            government: 0,
            legacy: 10,
            science: 10,
            upkeep: 0,
          },
          role: 'Researcher',
        },
        SET_ACTIVE_ACCOMPLISHMENTS: {
          data: {
            id: 6,
            role: 'Researcher',
            label: 'Highly Specialized',
            flavorText:
              "You're solely focused on your research, to the exclusion of all other pursuits.",
            science: 3,
            government: 0,
            legacy: 0,
            finance: 0,
            culture: 0,
            upkeep: 0,
            victoryPoints: 1,
            effect:
              'You can no longer make Politics or Legacy Influence. Science Influence only costs 1 Time Block to make.',
          },
          role: 'Researcher',
        },
      },
    ],
  },
  {
    target: '.tour-inventory',
    content: `You can view and reference your inventory of Resources here.`,
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
    content: `Click the Ready to Advance button when you have finished purchasing Accomplishments. `,
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
