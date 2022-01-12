import {
  MarsEventData,
  AccomplishmentData,
  Role,
} from "@port-of-mars/shared/types";

export type ModalActivator = "Server" | "User" | "Default";

export interface ModalData {
  activator: ModalActivator;
}

export type CardModalType = "EventCard" | "AccomplishmentCard";

export interface CardModalData extends ModalData {
  cardType: CardModalType;
  cardData: MarsEventData | AccomplishmentData;
}

export interface PlayerModalData {
  role: Role;
}

export interface TradeRequestModalData {}

export interface ManualData extends ModalData {}

export type ModalType =
  | "CardModal"
  | "ManualModal"
  | "PlayerModal"
  | "TradeRequestModal";

export type ModalDataType =
  | ModalData
  | ManualData
  | CardModalData
  | PlayerModalData
  | TradeRequestModalData;
