import {Step} from "@/types/tutorial";
import { Phase,RESEARCHER,CURATOR } from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-trade',
      content:
        'During the Trade Phase, you can trade influence currency with other ' +
        'players. Trading allows you to obtain other influence currencies ' +
        'that you yourself cannnot invest in so that you can purchase ' +
        'accomplishments later in the game.',
      params: {
        placement: 'right'
      },
      
      stateTransform:{
        SET_GAME_PHASE:Phase.trade,
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
        }
      },

    }
]

export default steps; 