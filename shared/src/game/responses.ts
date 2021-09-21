import { Role } from "@port-of-mars/shared/types";

export interface SetPlayerRole {
  kind: "set-player-role";
  role: Role;
}

export interface SetError {
  kind: "error";
  message: string;
}

export interface SetSfx {
  kind: "set-sfx";
  sfx: string;
}

export type Responses = SetPlayerRole | SetError | SetSfx;

export enum Sfx {
  // incoming server notification sounds
  CHAT_MESSAGE_NOTIFICATION = "notification/chat.mp3",
  TRADE_REQUEST_NOTIFICATION = "notification/tradeRequest.mp3",
  READY_OTHER_PLAYER = "notification/readyOtherPlayers.mp3",

  // user activity sounds
  DISCARD_ACCOMPLISHMENT = "action/discard.mp3",
  PURCHASE_ACCOMPLISHMENT = "action/purchase.mp3",

  READY_TO_ADVANCE = "action/ready.mp3",
  CANCEL_READY_TO_ADVANCE = "action/cancelReady.mp3",

  // trade
  INITIATE_TRADE_REQUEST = "action/initiateTradeRequest.mp3",
  SEND_TRADE_REQUEST = "action/sendTradeRequest.mp3",

  // invest
  ADD_CULTURE = "action/addCulture.mp3",
  ADD_FINANCE = "action/addFinance.mp3",
  ADD_GOVERNMENT = "action/addGovernment.mp3",
  ADD_LEGACY = "action/addLegacy.mp3",
  ADD_SCIENCE = "action/addScience.mp3",
  ADD_SYSTEM_HEALTH = "action/addSystemHealth.mp3",

  REMOVE_CULTURE = "action/removeCulture.mp3",
  REMOVE_FINANCE = "action/removeFinance.mp3",
  REMOVE_GOVERNMENT = "action/removeGovernment.mp3",
  REMOVE_LEGACY = "action/removeLegacy.mp3",
  REMOVE_SCIENCE = "action/removeScience.mp3",
  REMOVE_SYSTEM_HEALTH = "action/removeSystemHealth.mp3",

  // toggle modals

  TOGGLE_ACCOMPLISHMENTS = "action/toggleAccomplishments.mp3",
  TOGGLE_INVENTORY = "action/toggleInventory.mp3",
  TOGGLE_OTHER_PLAYERS = "action/toggleOtherPlayers.mp3",

  // general
  CLICK = "click.mp3",
}
