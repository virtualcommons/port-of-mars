import { Step } from '@port-of-mars/client/types/tutorial';
import newRound from './newRound';
import events from './events';
import gamePlay from './gamePlay';
import invest from './invest';
import player from './player';
import trade from './trade';
import systemHealth from './systemHealth';
import purchase from './purchase';
import discard from './discard';

// concatenate tutorial steps in order
export const tutorialSteps: Array<Step> = gamePlay.concat(
  systemHealth,
  player,
  newRound,
  events,
  invest,
  trade,
  purchase,
  discard
);

