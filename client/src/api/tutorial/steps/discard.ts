import { Step, TOP, RIGHT, LEFT } from '@port-of-mars/client/types/tutorial';
import {Phase, RESEARCHER} from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-phase',
    content: `Welcome to the Discard phase!`,
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
    target: '.tour-phase',
    content: `The last phase in a round is Discard. You can discard any Accomplishments you don't want to keep ` +
      `and draw up to three new Accomplishments at the beginning of the next round.`,
    params: {
      placement: RIGHT,
    },
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
      {
        SET_ROUND_INTRODUCTION: {
          systemHealthAtStartOfRound: 75,
          systemHealthMaintenanceCost: -25,
          systemHealthGroupContributions: 2 /* your system health contribution */ + 6*4 /* other player's system health contribution */,
          systemHealthMarsEvents: [],
          accomplishmentPurchases: [
            {
              name: 'Make Science Cool',
              victoryPoints: 4
            },
            {
              name: 'Grant Funk',
              victoryPoints: 3
            }
          ],
          completedTrades: []
        }
      },
      {
        SET_SYSTEM_HEALTH_CHANGES: {
          role: 'Researcher',
          data: {
            investment: 2,
            purchases: [
              {
                description: 'Grant Funk',
                systemHealth: -6
              }
              ]
          }
        }
      },
      {
        SET_ROUND: 2,
        SET_GAME_PHASE: Phase.newRound,
        SET_SYSTEM_HEALTH: 75 + 2 + 4*6 - 6
      }
    ],
  },
];

export default steps;
