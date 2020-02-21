import { Step, LEFT, TOP } from "@/types/tutorial";
import { Phase,RESEARCHER } from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-investments',
      content: `The second phase is the Investment phase!`,
      params: {
        placement: LEFT
      },
     
      stateTransform: [
        {SET_GAME_PHASE:Phase.invest,
        SET_INVESTMENT_COSTS:{data:{
          culture: 1001,
          finance: 1001,
          government: 3,
          legacy: 3,
          science: 2,
          upkeep: 1
        }, role: RESEARCHER},

      }],
    },
    {
      target: '.tour-investments',
      content:
        'You are allocated 10 Timeblocks (unless something says otherwise) to ' +
        'spend each round. You can spend Timeblocks on Upkeep or on ' +
        'Influence. Remember that you have 5 minutes to invest your Timeblocks.',
      params: {
        placement: 'top'
      },
      
    },
    {
      target: '.tour-investments',
      content: `You cannot recycle Timeblocks between rounds, so you should spend all of them, each round!`,
      params: {
        placement: 'top'
      },
      
    },
    {
      target: '.tour-investments',
      content:
        `The cost for each Influence is in the bottom right hand corner. Provided you have enough Timeblocks,
        you can purchase them by pressing the '+' button. If you decide against the purchase later, you can drop it by pressing '-'.`,
      params: {
        placement: 'right'
      },
      
    },
    {
      target: '.tour-investments',
      content: 'Quiz Question',
      params: {
        placement: TOP,
        tutorialElementId: 'timeblocks'
      }
    },
    {
      target: '.tour-donebtn',
      content:
        'You can hit the Done button to surrender your time if you have finished investing ' +
        'your Timeblocks before the 5 minutes for the Investment Phase is up.',
      params: {
        placement: 'right'
      },
      
    },
    {
      target: '.tour-investments',
      content: `Note that there are some Influences that you cannot purchase on your own (for the Researcher, they are Culture and Finance)
      However, you will need those resources to buy certain Accomplishment cards!`,
      params:{
        placement: 'top'
      }
    },
    {
      target: '.tour-accomplishments',
      content: `For example, this Accomplishment card requires 1 Culture, which you cannot create. To get that resource, you must trade!`,
      params: {
        placement:'right'
      }
    },
    // gamedashboard > containers > ContainerInvestments.vue

]

export default steps;