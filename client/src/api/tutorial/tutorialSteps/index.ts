import {Step} from '@/types/tutorial';
import events from './events';
import gamePlay from './gamePlay';
import invest from './invest';
import notifcations from './notifications';
import player from './player';
import trade from './trade';
import upkeep from './upkeep';


const steps:Array<Step> = gamePlay.concat(upkeep,player,events,invest,trade,notifcations)

export default steps;