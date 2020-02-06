import {Step} from "@/types/tutorial";
import {RESEARCHER} from 'shared/types';

const steps:Array<Step> = [
    {
      target: '.tour-notification',
      content:
        'You will be notifed about events and changes in Upkeep via notifications ' +
        'that pop up here. Hover over then notification to close it.',
      params: {
        placement: 'bottom'
      },
      stateTransform: {
        CREATE_NOTIFICATION:`Notifcations can be removed by clicking on them!`,
      },
    },
    {
      target: '.tour-marslog',
      content:
        'Any events and changes in upkeep that occur will be recorded in the Mars Log ' +
        'for your reference.',
      params: {
        placement: 'right'
      },
      
      stateTransform: {
        ADD_TO_MARS_LOG:{
          performedBy: RESEARCHER,
          category:'Event',
          content: `This event is important!`,
          timestamp:new Date().getTime(),
        },
      },
    },
]

export default steps;