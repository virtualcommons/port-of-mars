import { Step } from '@port-of-mars/client/types/tutorial';
import newRound from './newRound';
import newRound2 from './newRound2';
import events from './events';
import gamePlay from './gamePlay';
import invest from './invest';
import player from './player';
import trade from './trade';
import systemHealth from './systemHealth';
import purchase from './purchase';
import discard from './discard';
import _ from 'lodash';

// concatenate tutorial steps in order
export const tutorialSteps: Array<Step> = _.concat(
  gamePlay,
  systemHealth,
  player,
  newRound,
  invest,
  trade,
  purchase,
  discard,
  newRound2,
  events,
);

