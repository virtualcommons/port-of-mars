import { Step } from '@port-of-mars/client/types/tutorial';
import events from './events';
import gamePlay from './gamePlay';
import invest from './invest';
import notifications from './notifications';
import player from './player';
import trade from './trade';
import upkeep from './upkeep';
import purchase from './purchase';
import discard from './discard';

export const tutorialSteps: Array<Step> = gamePlay.concat(
  upkeep,
  player,
  events,
  invest,
  trade,
  purchase,
  discard,
  notifications
);

