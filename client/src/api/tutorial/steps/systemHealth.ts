import { Step, BOTTOM } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-system-health',
    content:
      `System Health starts at 100 which represents your habitat at peak condition and maintenance.
       At the start of each round, your habitat will <b>lose 25 System Health due to standard wear
       and tear</b>.`,
    params: {
      placement: BOTTOM
    }
  },
  // {
  //   target: '.tour-system-health',
  //   content: 'Quiz Question',
  //   params: {
  //     placement: BOTTOM,
  //     tutorialElementId: 'upkeep25'
  //   }
  // },
  // FIXME: will probably be covered in the preface video
  // {
  //   target: '.tour-system-health',
  //   content: `In order to stay alive, System Health <b>must stay above 0</b>. The game will end if System Health reaches 0 or below.`,
  //   params: {
  //     placement: BOTTOM
  //   }
  // }
];

export default steps;
