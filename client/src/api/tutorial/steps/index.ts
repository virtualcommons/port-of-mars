import { Step } from "@port-of-mars/client/types/tutorial";
import newRound from "./newRound";
import events from "./events";
import intro from "./introduction";
import invest from "./invest";
import player from "./player";
import trade from "./trade";
import systemHealth from "./systemHealth";
import purchase from "./purchase";
import discard from "./discard";
import _ from "lodash";

// concatenate tutorial steps in order
export const tutorialSteps: Array<Step> = _.concat(
  intro,
  systemHealth,
  player,
  newRound,
  events,
  invest,
  trade,
  purchase,
  discard
);
