import {Step} from "@/types/tutorial";
import { Phase,RESEARCHER } from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-investments',
      content:
        'During the Investment phase, you may invest your timeblocks into ' +
        'Upkeep or purchase Influence currency.',
      params: {
        placement: 'right'
      },
     
      stateTransform: {
        SET_GAME_PHASE:Phase.invest,
        SET_INVESTMENT_COSTS:{data:{
          culture: 1001,
          finance: 1001,
          government: 3,
          legacy: 3,
          science: 2,
          upkeep: 1
        }, role: RESEARCHER},

      },
    },
    {
      target: '.tour-investments',
      content:
        'You are allocated 10 timeblocks (unless something says otherwise) to ' +
        'spend each round. You can spend timeblocks on Upkeep or on ' +
        'Influence. Remember that you have 5 minutes to invest your timeblocks.',
      params: {
        placement: 'top'
      },
      
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.tour-investments',
      content:
        'During the Investment phase, you can invest your timeblocks to obtain ' +
        'influence currency and use your influence currency inventory to trade ' +
        'with other players in the Trade phase.',
      params: {
        placement: 'right'
      },
      
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.tour-investments',
      content:
        'You can also use your timeblocks to keep your habitat from collapsing by ' +
        'investing your timeblocks in Upkeep.',
      params: {
        placement: 'right'
      },
     
    },
    // gamedashboard > containers > ContainerInvestments.vue
    {
      target: '.tour-investments',
      content:
        'The cost of the card in timeblocks in located at the bottom right corner ' +
        'of the card. Use the increment (+) button on a card to invest your timeblocks or ' +
        'the decrement (-) button to remove timeblocks from an investment ' +
        'that you have made.',
      params: {
        placement: 'right'
      },
      
    },
    {
      target: '.tour-donebtn',
      content:
        'You can hit the Done button to surrender your time if you have finished investing ' +
        'your timeblocks before the 5 minutes for the Investment Phase is up.',
      params: {
        placement: 'right'
      },
      
    },

]

export default steps;