import { Step, LEFT, TOP, RIGHT, BOTTOM } from '@port-of-mars/client/types/tutorial';
import { Phase, RESEARCHER } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: '.tour-phase-instructions',
    content: `At the beginning of each round a System Health Report (SHR) is generated ` +
      `to report your group's contributions to System Health from the previous round.`,
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
    target: '.tour-wear-tear',
    content: 'Due to wear and tear, System Health will always decrease -25 at the beginning of each round.',
    params: {
      placement: LEFT
    }
  },
  {
    target: '.tour-shr-table',
    content: 'This report details: System Health from previous round and all occurrences that ' +
    'affect System Health including group contributions during Invest phase, wear and tear and ' +
    'purchased Accomplishments.',
    params: {
      placement: LEFT
    }
  },
  {
    target: '.tour-report',
    content: `Your group's total contributions = (sum of each ` +
      `player's investments to System Health during the Invest phase) - (sum of players' purchased ` +
      `Accomplishments that subtracted from System Health)`,
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-report-hint',
    content: 'If System Health drops below 65, more than one Event will affect your group.',
    params: {
      placement: LEFT,
    }
  }
];

export default steps;
