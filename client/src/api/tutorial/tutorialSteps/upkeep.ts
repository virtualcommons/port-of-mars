import {Step} from "@/types/tutorial";

const steps:Array<Step> = [
    {
      target: '.tour-container-upkeep',
      content:
        'The game starts with Upkeep at 100. This represents the habitat at peak ' +
        'condition and maintenance. However, at the start of every round, the ' +
        'community loses 25 Upkeep.',
      params: {
        placement: 'bottom'
      }
    },
    {
      target: '.tour-container-upkeep',
      content:
        'At the start of a round, if Upkeep is lower than 65, reveal 2 events; ' +
        'and if Upkeep is lower than 35 reveal 3 events. Conditions on Mars ' +
        'are tough!',
      params: {
        placement: 'bottom'
      }
    },

]

export default steps;