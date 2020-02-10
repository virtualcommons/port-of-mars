import {Step} from '@/types/tutorial';
import events from './events';
import gamePlay from './gamePlay';
import invest from './invest';
import notifcations from './notifications';
import player from './player';
import trade from './trade';
import upkeep from './upkeep';
import purchase from './purchase';
import discard from './discard';


const steps:Array<Step> = gamePlay.concat(upkeep,player,events,invest,trade,purchase,discard,notifcations)

export default steps;