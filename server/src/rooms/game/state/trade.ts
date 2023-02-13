import { Schema, type } from "@colyseus/schema";
import {
  ResourceAmountData,
  Role,
  TradeAmountData,
  TradeData,
  TradeStatus,
} from "@port-of-mars/shared/types";
import _ from "lodash";
import { ResourceInventory } from "@port-of-mars/server/rooms/game/state/resource";
import { GameState } from "@port-of-mars/server/rooms/game/state/game";

export class TradeAmount extends Schema {
  constructor(role: Role, resourceAmount: ResourceAmountData) {
    super();
    this.role = role;
    this.resourceAmount = new ResourceInventory();
    this.resourceAmount.fromJSON(resourceAmount);
  }

  fromJSON(data: TradeAmountData): void {
    this.role = data.role;
    this.resourceAmount.fromJSON(data.resourceAmount);
  }

  toJSON(): TradeAmountData {
    return {
      role: this.role,
      resourceAmount: this.resourceAmount,
    };
  }

  @type("string")
  role: Role;

  @type(ResourceInventory)
  resourceAmount: ResourceInventory;
}

export class Trade extends Schema implements TradeData<TradeAmount> {
  constructor(
    id: string,
    sender: TradeAmountData,
    recipient: TradeAmountData,
    status: TradeStatus
  ) {
    super();
    this.id = id;
    this.sender = new TradeAmount(sender.role, sender.resourceAmount);
    this.recipient = new TradeAmount(recipient.role, recipient.resourceAmount);
    this.status = status;
  }

  fromJSON(data: TradeData): void {
    this.id = data.id;
    this.sender.fromJSON(data.sender);
    this.recipient.fromJSON(data.recipient);
    this.status = data.status;
  }

  toJSON(): TradeData {
    return {
      id: this.id,
      sender: this.sender.toJSON(),
      recipient: this.recipient.toJSON(),
      status: this.status,
    };
  }

  @type("string")
  id: string;

  @type(TradeAmount)
  sender: TradeAmount;

  @type(TradeAmount)
  recipient: TradeAmount;

  @type("string")
  status: TradeStatus;

  apply(state: GameState): void {
    const pFrom = state.players[this.sender.role];
    const pTo = state.players[this.recipient.role];

    pFrom.inventory.add(_.mapValues(this.sender.resourceAmount, r => -r!));
    pFrom.inventory.add(this.recipient.resourceAmount);
    //pFrom.pendingInvestments.rollback({...this.from.resourceAmount,systemHealth:0});

    pTo.inventory.add(_.mapValues(this.recipient.resourceAmount, r => -r!));
    pTo.inventory.add(this.sender.resourceAmount);

    this.status = "Accepted";
  }
}
