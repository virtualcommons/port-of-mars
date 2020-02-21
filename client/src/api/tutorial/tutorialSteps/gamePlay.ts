import {Step, TOP} from "@/types/tutorial";
import {CURATOR} from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-round',
      content:
        `The game progresses in rounds. The number of rounds changes from game to game, so the game could
        end at any time`,
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
          `During gameplay, you can communicate with other players in your habitat 
          to plan and strategize. You can do this at any time during the game.
          Keep in mind that all chat is public and there are no private messages!
          Try sending a message!`,
        params: {
          placement: 'left'
        },
        stateTransform:[
          {
            SET_LAYOUT: 'tutorial',
            ADD_TO_CHAT:{
              message:'Welcome to the port of mars!',
              role:CURATOR,
              dateCreated:new Date().getTime(),
              round:0,
          },
          required: true,
        }],
      },
      {
        target: '.tour-chat',
        content: 'Quiz Question',
        params: {
          placement: TOP,
          tutorialElementId: 'chat'
        }
      },
]

export default steps;