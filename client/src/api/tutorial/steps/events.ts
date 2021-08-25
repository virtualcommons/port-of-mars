import { Step, RIGHT } from '@port-of-mars/client/types/tutorial';
import { Phase, RESEARCHER } from '@port-of-mars/shared/types';

const steps: Array<Step> = [
  {
    target: '.tour-event',
    content:
      `Mars is unpredictable; many different events can happen! The number of events
      that occur during each round depends on your System Health`,
    params: {
      placement: RIGHT,
    },
    stateTransform: [
      {
        SET_GAME_PHASE: Phase.events,
        SET_INVESTMENT_COSTS: {
          data: {
            culture: Number.MAX_SAFE_INTEGER,
            finance: Number.MAX_SAFE_INTEGER,
            government: 3,
            legacy: 3,
            science: 2,
            systemHealth: 1
          },
          role: RESEARCHER,
        },
        // FIXME: this should be pulling its data from MarsEvents, which I suppose makes a case for keeping them in shared instead?
        ADD_TO_EVENTS: {
          id: 'changingTides',
          name: 'Changing Tides',
          effect: `Each player discards all their Accomplishment cards and draws 1 new
          Accomplishment card. (They still draw up to a total of three cards at the end
          of this round.)`,
          flavorText: `Create contingencies for your contingencies and contingencies for
          those contingencies. Then prepare to improvise.`,
          clientViewHandler: 'NO_CHANGE' as const,
          duration: 1,
        },
      },
    ],
  },
  // {
  //   target: '.tour-system-health',
  //   content: `Remember: as System Health decreases, the number of Events your group encounters will increase.`,
  //   params: {
  //     placement: BOTTOM,
  //   },
  // },
  // {
  //   target: '.tour-event-deck',
  //   content: `Events relevant to the current round are displayed here.
  //    Some events can affect your group for more than one round - indicated by their <b>Duration</b>.`,
  //   params: {
  //     placement: LEFT,
  //   },
  // },
  // {
  //   target: '.tour-event-view',
  //   content: `You can switch between the phase info screen and current Events by clicking on the Active Events icon above this panel.
  //    The Mars Log also documents all current and past Events.`,
  //   params: {
  //     placement: LEFT,
  //   },
  //   stateTransform: [
  //     {
  //       SET_HUDRIGHT_VIEW: HUDRightView.ActiveEvents,
  //     },
  //   ],
  // },
];

export default steps;
