import { Step, TOP, LEFT } from "@port-of-mars/client/types/tutorial";
import { Phase } from "@port-of-mars/shared/types";

const steps: Array<Step> = [
  {
    target: ".tour-phase",
    content:
      `At the beginning of each round a report is generated ` +
      `that details all activities that affected System Health in the previous round.`,
    params: {
      placement: LEFT
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.newRound
      }
    ]
  },
  {
    target: ".tour-wear-tear",
    content: `Due to wear and tear, System Health <b>always decreases by 25</b> at the beginning of each round.
    If your System Health reaches 0, your Port of Mars journey will come to an end.`,
    params: {
      placement: TOP
    }
  }
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
