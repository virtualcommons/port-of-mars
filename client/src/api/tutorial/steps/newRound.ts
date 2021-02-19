import { Step, LEFT, TOP, BOTTOM, RIGHT } from '@port-of-mars/client/types/tutorial';
import { Phase } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: '.tour-phase-instructions',
    content: `At the beginning of each round a System Health Report (SHR) is generated ` +
      `to report your group's contributions to System Health from the previous round.`,
    params: {
      placement: LEFT,
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.newRound
      },
    ],
  },
  {
    target: '.tour-report',
    content: 'Here is an example System Health Report.',
    params: {
      placement: LEFT,
    }
  },
  {
    target: '.tour-wear-tear',
    content: `Due to wear and tear, System Health will <b>always decrease by 25</b> at the beginning of each round.
     If your System Health reaches 0, your Port of Mars journey will come to an end.`,
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-shr-table',
    content: `This report shows your System Health from the previous round and everything that
    affected System Health that round. This includes your group's System Health investments,
    purchased Accomplishments that cost System Health, and Events that affect System Health.`,
    params: {
      placement: RIGHT,
    }
  },
  {
    target: '.tour-report',
    content: `Your group's total contributions = (all player investments to System Health during the Investment phase)
     - (all purchased Accomplishments that decreased System Health)`,
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-report-hint',
    content: 'If System Health drops below 65, more than one Event will affect your group during the Event phase.',
    params: {
      placement: LEFT,
    }
  },
  {
    target: '.tour-system-health',
    content: 'Quiz Question',
    params: {
      placement: BOTTOM,
      tutorialElementId: 'upkeep65'
    }
  },
  {
    target: '.tour-system-health',
    content: 'Quiz Question',
    params: {
      placement: BOTTOM,
      tutorialElementId: 'upkeep35'
    }
  }
];

export default steps;
