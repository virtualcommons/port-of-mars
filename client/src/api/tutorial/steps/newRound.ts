import { Step, TOP } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  // {
  //   target: '.tour-phase-instructions',
  //   content: `At the beginning of each round a System Health Report is generated ` +
  //     `with details on all activities that affected System Health in the previous round.`,
  //   params: {
  //     placement: LEFT,
  //   },
  //   stateTransform: [
  //     {
  //       SET_GAME_PHASE: Phase.newRound
  //     },
  //   ],
  // },
  {
    target: '.tour-wear-tear',
    content: `Let's take a closer look at this System Health Report. Due to wear and tear,
    System Health <b>always decreases by 25</b> at the beginning of each round.
    If your System Health reaches 0, your Port of Mars journey will come to an end.`,
    params: {
      placement: TOP,
    }
  },
  // {
  //   target: '.tour-shr-table',
  //   content: `This table shows your System Health from the previous round and everything that
  //   affected System Health that round. This includes your Group Contributions to System Health,
  //   purchased Accomplishments that cost System Health, and Events that affect System Health.`,
  //   params: {
  //     placement: RIGHT,
  //   }
  // },
  // {
  //   target: '.tour-report',
  //   content: `Group Contributions are the sum of all player time block investments in System Health in the previous round.`,
  //   params: {
  //     placement: TOP,
  //   }
  // },
  // {
  //   target: '.tour-report-hint',
  //   content: 'If System Health drops below 65, more than one Event will affect your group during the Event phase.',
  //   params: {
  //     placement: LEFT,
  //   }
  // },
  // {
  //   target: '.tour-system-health',
  //   content: 'Quiz Question',
  //   params: {
  //     placement: BOTTOM,
  //     tutorialElementId: 'upkeep65'
  //   }
  // },
  // {
  //   target: '.tour-system-health',
  //   content: 'Quiz Question',
  //   params: {
  //     placement: BOTTOM,
  //     tutorialElementId: 'upkeep35'
  //   }
  // }
];

export default steps;
