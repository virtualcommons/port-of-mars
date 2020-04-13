import {
  MarsEventData,
  AccomplishmentData,
  Role,
} from '@port-of-mars/shared/types';

export type ModalActivator = 'Server' | 'User' | 'Default';

export interface GeneralModalData {
  activator: ModalActivator;
  title: string;
  content: string;
}

export type CardModalType = 'EventCard' | 'AccomplishmentCard';

export interface CardModalData extends GeneralModalData {
  cardType: CardModalType;
  cardData: MarsEventData | AccomplishmentData;
  confirmation: boolean;
}

export interface PlayerInfoModalData {
  role: Role;
}

export interface TradeRequestModalData {}

export type ModalViewType =
  | 'GeneralModal'
  | 'CardModal'
  | 'PlayerInfoModal'
  | 'TradeRequestModal';

export type ModalDataType =
  | GeneralModalData
  | CardModalData
  | PlayerInfoModalData
  | TradeRequestModalData;
