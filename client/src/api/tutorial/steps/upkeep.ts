import { Step, LEFT, BOTTOM } from '@port-of-mars/client/types/tutorial';

const steps: Array<Step> = [
  {
    target: '.tour-system-health',
    content:
      `The game starts with System Health at 100. This represents the habitat at peak ` +
      `condition and maintenance. However, at the start of every round, the ` +
      `community loses 25 System Health.`,
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
      `At the start of a round, if System Health is lower than 65, 2 Events will occur in the round; ` +
      `if System Health is lower than 35, 3 Events will occur. Conditions on Mars ` +
      `are tough!`,
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
