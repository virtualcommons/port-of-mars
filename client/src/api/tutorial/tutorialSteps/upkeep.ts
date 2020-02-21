import {Step, LEFT} from "@/types/tutorial";

const steps:Array<Step> = [
    {
      target: '.tour-container-upkeep',
      content:
        'The game starts with Upkeep at 100. This represents the habitat at peak ' +
        'condition and maintenance. However, at the start of every round, the ' +
        'community loses 25 Upkeep.',
      params: {
        placement: 'bottom',
      }
    },
    {
      target: '.tour-container-upkeep',
      content: 'Quiz Question',
      params: {
        placement: LEFT,
        tutorialElementId: 'upkeep25'
      }
    },
    {
      target: '.tour-container-upkeep',
      content:
        'At the start of a round, if Upkeep is lower than 65, 2 Events will occur in the round; ' +
        'if Upkeep is lower than 35, 3 Events will occur. Conditions on Mars ' +
        'are tough!',
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '.tour-container-upkeep',
      content: 'Quiz Question',
      params: {
        placement: LEFT,
        tutorialElementId: 'upkeep65'
      }
    },
    {
      target: '.tour-container-upkeep',
      content: 'Quiz Question',
      params: {
        placement: LEFT,
        tutorialElementId: 'upkeep35'
      }
    },
]

export default steps;