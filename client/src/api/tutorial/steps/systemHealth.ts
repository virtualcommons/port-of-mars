import { Step, BOTTOM } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-system-health',
    content:
      `You arrive at the Port of Mars with an initial System Health of 100. This represents your habitat
      at peak condition and maintenance. At the start of each round your habitat will <b>lose 25 System
      Health due to standard wear and tear</b>.`,
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
    content: `In order to stay alive, System Health <b>must stay above 0</b>. The game will end if System Health reaches 0 or below.`,
    params: {
      placement: BOTTOM
    }
  }
];

export default steps;
