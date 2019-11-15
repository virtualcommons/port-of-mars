export interface SendChatMessage {
  kind: 'send-chat-message'
  message: string
}

export interface BuyAccomplishmentCard {
  kind: 'buy-accomplishment-card',
  id: number
}

export type Requests = SendChatMessage | BuyAccomplishmentCard