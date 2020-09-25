import { Step, LEFT, BOTTOM } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-system-health',
    content:
      `You begin at the Port of Mars with an initial System Health of 100. This represents your habitat 
      at peak condition and maintenance. At the start of every round, your community will lose 25 System 
      Health due to standard wear and tear.`,
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '.tour-system-health',
    content: 'Quiz Question',
    params: {
      placement: LEFT,
      tutorialElementId: 'upkeep25'
    }
  },
  {
    target: '.tour-system-health',
    content:
      `If System Health is lower than 65 at the start of the round, your group will be affected by 2 Events. ` +
      `If System Health is lower than 35, your group will be affected by 3 Events. Conditions on Mars are tough!`,
    params: {
      placement: BOTTOM
    }
  },
  {
    target: '.tour-system-health',
    content: 'Quiz Question',
    params: {
      placement: LEFT,
      tutorialElementId: 'upkeep65'
    }
  },
  {
    target: '.tour-system-health',
    content: 'Quiz Question',
    params: {
      placement: LEFT,
      tutorialElementId: 'upkeep35'
    }
  }
];

export default steps;