import { Step, LEFT, TOP, RIGHT, BOTTOM } from '@port-of-mars/client/types/tutorial';
import {Phase, RESEARCHER} from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: '.tour-phase-instructions',
    content: 'During the New Round phase, a System Health Report (SHR) is generated to report players\' contributions to system health from the previous round.',
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.newRound
      },
    ],
  },
  {
    target: '.tour-report',
    content: 'Here is an example of an SHR.',
    params: {
      placement: LEFT
    }
  },
  {
    target: '.tour-report',
    content: 'Your players\' total contributions is the net amount which is calculated by (players\'s contributions to System Health during Invest phase - purchased accomplishments that subtract from System Health.',
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-report-hint',
    content: 'More than 1 Event will occur if System Health < 65.',
    params: {
      placement: LEFT,
    }
  }
];

export default steps;
