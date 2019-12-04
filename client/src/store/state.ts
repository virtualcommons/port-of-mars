import {InvestmentsModel, MarsLogModel} from "@/models";
import {ChatMessageData, MarsEventData, Phase, RESEARCHER, Role} from "shared/types";
import {Accomplishment} from "@/models/AccomplishmentsModels";

export interface State {
  playerRole: Role
  playerScore: 0
  marsLog: MarsLogModel
  activeAccomplishmentCards: Array<Accomplishment>
  boughtAccomplishmentCards: Array<Accomplishment>
  chat: Array<ChatMessageData>
  upkeep: number
  round: number
  players: Array<object>
  timeblocks: number
  timeRemaining: number
  playerResources: object
  gameEvents: Array<MarsEventData>

  gamePhase: Phase
  layout: string

  //notifIsActive: string
  //notifMessage: string
  activeNotifications: Array<String>

  tradingView: string
  tradingMember: Role

  localInvestments: InvestmentsModel
}

export const initialStoreState: State = {
  // server side
  playerRole: RESEARCHER,
  playerScore: 0,
  marsLog: new MarsLogModel(),
  activeAccomplishmentCards: [],
  boughtAccomplishmentCards: [],
  chat: [],
  upkeep: 100,
  round: 1,
  players: [],
  timeblocks: 10,
  timeRemaining: 300,
  playerResources: {},
  gameEvents: [],

  // phase
  gamePhase: Phase.pregame,
  // playerFinishedWithPhase: false,

  // state variable for layout
  layout: 'default-layout',

  // notification
  //notifIsActive: 'inactive',
  //notifMessage: '',
  activeNotifications: [],

  // state variables for trading modal
  tradingView: 'request',
  tradingMember: 'Curator',

  // this will be merged with the global investments
  // at the end of each round.
  localInvestments: new InvestmentsModel()
};
