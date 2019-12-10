import {InvestmentsModel, MarsLogModel} from "@/models";
import {
  ChatMessageData,
  MarsEventData,
  Phase,
  RESEARCHER,
  Role,
  ResourceCostData,
  ResourceAmountData,
  PlayerData,
  InvestmentData,
  CURATOR, ENTREPRENEUR, POLITICIAN, PIONEER, GameData
} from "shared/types";
import {Accomplishment} from "@/models/AccomplishmentsModels";

export interface PlayerClientData extends PlayerData {
  pendingInvestments: InvestmentData
}

type PlayerClientSet = { [role in Role]: PlayerClientData }

function defaultPlayerClientSet(): PlayerClientSet {
  return {
    Curator: defaultPlayerData(CURATOR),
    Entrepreneur: defaultPlayerData(ENTREPRENEUR),
    Politician: defaultPlayerData(POLITICIAN),
    Pioneer: defaultPlayerData(PIONEER),
    Researcher: defaultPlayerData(RESEARCHER)
  }
}

function defaultPlayerData(role: Role): PlayerClientData {
  return {
    role,
    accomplishment: {
      bought: [],
      purchasable: []
    },
    costs: defaultCostData(role),
    inventory: defaultInventory(role),
    ready: false,
    timeBlocks: 10,
    victoryPoints: 0,
    pendingInvestments: defaultPendingInvestment(),
    contributedUpkeep: 0
  }
}

function defaultCostData(role: Role): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    upkeep: 0,
  }
}

function defaultInventory(role: Role): ResourceAmountData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
  }
}

function defaultPendingInvestment(): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    upkeep: 0
  }
}

export interface State extends GameData {
  role: Role
  marsLog: MarsLogModel
  players: PlayerClientSet

  phase: Phase
  layout: string

  activeNotifications: Array<String>

  tradingView: string
  tradingMember: Role
}

export const initialStoreState: State = {
  // server side
  role: RESEARCHER,
  marsLog: new MarsLogModel(),
  messages: [],
  upkeep: 100,
  round: 1,
  players: defaultPlayerClientSet(),
  timeRemaining: 300,
  marsEvents: [],
  marsEventsProcessed: 0,


  // phase
  phase: Phase.pregame,

  layout: 'default-layout',

  activeNotifications: [],

  // state variables for trading modal
  tradingView: 'request',
  tradingMember: 'Curator',
};
