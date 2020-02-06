import { Step } from "@/types/tutorial";
import { Phase } from "shared/types";

const steps:Array<Step> = [
    {
      target: '.tour-container-bottom',
      content:
        'Events are revealed at the beginning of every round during the events phase. ' +
        'Some events can be more involved and require players to fulfill tasks ' +
        'that include voting. Mars is unpredictable; many different events can happen!',
      params: {
        placement: 'bottom'
      },
      stateTransform: {
        SET_GAME_PHASE:Phase.events,
        ADD_TO_EVENTS:{
          id: 0,
          name: 'Changing Tides',
          effect: `Each player discards all their Accomplishment cards and draws 1 new Accomplishment card. (They still draw up to a total of three cards at the end of this round.)`,
          flavorText: `Create contingencies for your contingencies and contingencies for those contingencies. Then prepare to improvise.`,
          serverActionHandler: undefined,
          clientViewHandler: 'NO_CHANGE' as const,
          clientActionHandler: undefined,
          duration: 1},
      },
    },
    {
        target: '.tour-phase',
        content:
          'Events persisting multiple rounds or relevant to the current round ' +
          'will populate here.',
        params: {
          placement: 'left'
        },
        
        
      },
]

export default steps;