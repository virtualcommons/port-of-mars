import { Step, LEFT, BOTTOM } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-system-health',
    content:
      `You begin at the Port of Mars with an initial System Health of 100. This represents your habitat
      at peak condition and maintenance. At the start of every round your habitat will lose 25 System
      Health due to standard wear and tear.`,
    params: {
      placement: BOTTOM
    }
  },
  {
    target: '.tour-system-health',
    content: 'Quiz Question',
    params: {
      placement: BOTTOM,
      tutorialElementId: 'upkeep25'
    }
  },
  {
    target: '.tour-system-health',
    content: `In order to stay alive your group's System Health must stay above 0. If System Health reaches 0 or below it is game over.`,
    params: {
      placement: BOTTOM
    }
  }
];

export default steps;
