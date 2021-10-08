import { Step, BOTTOM } from "@port-of-mars/client/types/tutorial";

const steps: Array<Step> = [
  {
    target: ".tour-system-health",
    content: `System Health starts at 100 which represents your habitat at peak condition and maintenance.
       At the start of each round, your habitat will <b>lose 25 System Health due to standard wear
       and tear</b>.`,
    params: {
      placement: BOTTOM
    }
  }
  // {
  //   target: '.tour-system-health',
  //   content: 'Quiz Question',
  //   params: {
  //     placement: BOTTOM,
  //     tutorialElementId: 'upkeep25'
  //   }
  // },
];

export default steps;
