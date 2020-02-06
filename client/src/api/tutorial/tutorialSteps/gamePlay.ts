import {Step} from "@/types/tutorial";
import {CURATOR} from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-round',
      content:
        'The game progresses in rounds. There is an indefinite number ' +
        'of rounds per game. Therefore, the game can end at any time given ' +
        'that Upkeep does not decline to zero.',
      params: {
        placement: 'right'
      }
    },
    {
      target: '.tour-container-top',
      content:
        'There are multiple phases in a round: Events, Invest, Trade, Purchase ' +
        ' and Discard. Each phase has a time limit of 5 minutes.',
      params: {
        placement: 'bottom'
      }
    },
    {
        target: '.tour-chat',
        content:
          'During gameplay, you can communicate with other players in your habitat ' +
          'to plan and strategize.',
        params: {
          placement: 'left'
        },
        stateTransform:{
          ADD_TO_CHAT:{
              message:'Welcome to the port of mars!',
              role:CURATOR,
              dateCreated:new Date().getTime(),
              round:0,
          }
        },
      },
]

export default steps;