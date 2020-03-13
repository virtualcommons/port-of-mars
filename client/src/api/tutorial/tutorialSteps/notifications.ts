import {Step} from "@/types/tutorial";
import {RESEARCHER, Phase} from '@port-of-mars/shared/types';

const steps:Array<Step> = [
    {
      target: '.tour-notification',
      content:
        'You will be notifed about trades and other things relevant to you via Notifications ' +
        'that pop up here.',
      params: {
        placement: 'bottom'
      },
      stateTransform: [
        {
          SET_GAME_PHASE:Phase.invest,
          CREATE_NOTIFICATION:{
            data:`Notifcations can be removed by clicking on them!`,
            role: `Researcher`,
          },
      }],
    },
    {
      target: '.tour-marslog',
      content:
        `Items that are relevent to the group like System Health dropping and new Events are displayed here.
        These logs will persist through the entirety of the game`,
      params: {
        placement: 'right'
      },

      stateTransform: [
        {ADD_TO_MARS_LOG:{
          performedBy: RESEARCHER,
          category:'Event',
          content: `This event is important!`,
          timestamp:new Date().getTime(),
        },
        required:false,
      }],
    },
]

export default steps;
