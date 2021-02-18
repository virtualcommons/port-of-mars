import {BOTTOM, LEFT, RIGHT, TOP} from "@port-of-mars/client/types/tutorial";

const steps = [
  {
    target: '.tour-phase',
    content: 'Welcome to the New Round phase of Round 2!',
    params: {
      placement: RIGHT
    }
  },
  {
    target: '.tour-shr-table',
    content: 'This report shows your System Health from the previous round and all actions that ' +
    'affected your System Health including the contributions your group made towards System Health during the Investment phase, wear and tear and ' +
    'purchased Accomplishments.',
    params: {
      placement: RIGHT
    }
  },
  {
    target: '.tour-report',
    content: `Your group's total contributions = (sum of each ` +
      `player's investments to System Health during the Investment phase) - (sum of players' purchased ` +
      `Accomplishments that decreased System Health)`,
    params: {
      placement: TOP,
    }
  },
  {
    target: '.tour-report-hint',
    content: 'If System Health is between 35 and 65, two Events will be generated.',
    params: {
      placement: LEFT,
    }
  },
]

export default steps;
