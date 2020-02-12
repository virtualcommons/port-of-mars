import {Step} from "@/types/tutorial";
import { Phase,RESEARCHER,CURATOR } from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-trade',
      content:
        `The next phase is the trading phase! Here you will trade for resources that you need to purchase accomplishment cards!`,
      params: {
        placement: 'right'
      },
      
      stateTransform:[
        {SET_GAME_PHASE:Phase.trade,
        SET_INVENTORY:{
          data:{
            culture: 0,
            finance: 5,
            government: 5,
            legacy: 0,
            science: 5,
            upkeep: 0,
          },
          role:RESEARCHER,
        },
        ADD_TO_TRADES:{
          id:'mock-trade',
          trade:{
            from:{
              role:CURATOR,
              resourceAmount:{
                culture: 1,
                finance: 1,
                government: 1,
                legacy: 1,
                science: 1,
              }
            },
            to:{
              role:RESEARCHER,
              resourceAmount:{
                culture: 1,
                finance: 1,
                government: 1,
                legacy: 1,
                science: 1,
              }
            }
          }
        }}
      ],
    },
    {
      target: '.tour-trade-item',
      content: `All active trades are listed here. If you are on the reciving end of a trade, you will have the option to either 
      accept or decline the trade.
      If you are the sender of a trade, you only have the option to cancel the request.`,
      params:{
        placement: 'top',
      }
    },
    {
      target: '.tour-chat',
      content:`Before making trade requests, you should talk about your plans in chat!`,
      params: {
        placement: 'left'
      },
      stateTransform:[
        {ADD_TO_CHAT:{
            message:'Hey Researcher, can I have 2 science in exchange for 1 legacy?',
            role:`Pioneer`,
            dateCreated:new Date().getTime(),
            round:0,
        }},
        {ADD_TO_CHAT:{
          message:'Sure, let me make that trade right now!',
          role:`Researcher`,
          dateCreated:new Date().getTime(),
          round:0,
      }},
      ],
    },
    {
      target: '.tour-trade-partner',
      content: `To request a trade, you must first select a person to trade with.`,
      params:{
        placement:'bottom',
      }
    },
    {
      target: '.tour-give-up',
      content: `Then, you select the amount of each resource you are willing to give up.
      You cannot send more resources than you currently have.`,
      params:{
        placement:'bottom',
      }
    },
    {
      target: '.tour-give-up',
      content: `Then, you select the amount of each resource you are willing to give up.
      You cannot send more resources than you currently have.`,
      params:{
        placement:'bottom',
      }
    },
    {
      target: '.tour-get-in-return',
      content: `Finally, you choose how much of any resource that you want.`,
      params:{
        placement:'bottom',
      }
    },
    {
      target: '.tour-container-bottom',
      content: `Hit send to see your trade in action!`,
      params:{
        placement:'left'
      },
      stateTransform:[
        {required:true}
      ]
    },
    {
      target: '.tour-container-bottom',
      content: 'Quiz Question',
      params: {
        placement: 'bottom',
        tutorialElementId: 'trade'
      }
    }

]

export default steps; 