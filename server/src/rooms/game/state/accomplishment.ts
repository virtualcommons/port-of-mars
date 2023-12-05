import { ArraySchema, Schema, type } from "@colyseus/schema";
import {
  AccomplishmentData,
  AccomplishmentSetData,
  Role,
  AccomplishmentPurchaseData,
} from "@port-of-mars/shared/types";
import _ from "lodash";
import * as assert from "assert";
import {
  getAccomplishmentByID,
  getAccomplishmentIDs,
} from "@port-of-mars/server/data/Accomplishment";
import { settings } from "@port-of-mars/server/settings";
import {
  AccomplishmentSetSerialized,
  AccomplishmentSetSummary,
} from "@port-of-mars/server/rooms/game/state/types";

const logger = settings.logging.getLogger(__filename);

export class AccomplishmentPurchase extends Schema implements AccomplishmentPurchaseData {
  constructor(data: AccomplishmentPurchaseData) {
    super();
    this.name = data.name;
    this.victoryPoints = data.victoryPoints;
    this.systemHealthModification = data.systemHealthModification;
  }

  toJSON(): AccomplishmentPurchaseData {
    return {
      name: this.name,
      victoryPoints: this.victoryPoints,
      systemHealthModification: this.systemHealthModification,
    };
  }

  fromJSON(data: AccomplishmentPurchaseData): void {
    Object.assign(this, data);
  }

  @type("string")
  name: string;

  @type("number")
  victoryPoints: number;

  @type("number")
  systemHealthModification: number;
}

export class Accomplishment extends Schema implements AccomplishmentData {
  constructor(data: AccomplishmentData) {
    super();
    this.id = data.id;
    this.role = data.role;
    this.label = data.label;
    this.flavorText = data.flavorText;
    this.science = data.science;
    this.government = data.government;
    this.legacy = data.legacy;
    this.finance = data.finance;
    this.culture = data.culture;
    this.systemHealth = data.systemHealth;
    this.victoryPoints = data.victoryPoints;
    this.effect = data.effect;
  }

  fromJSON(data: { role: Role; id: number }): void {
    Object.assign(this, getAccomplishmentByID(data.role, data.id));
  }

  toString(): string {
    return JSON.stringify(super.toJSON());
  }

  toJSON(): { role: Role; id: number } {
    return { role: this.role, id: this.id };
  }

  @type("number")
  id: number;

  @type("string")
  role: Role;

  @type("string")
  label: string;

  @type("string")
  flavorText: string;

  @type("number")
  science: number;

  @type("number")
  government: number;

  @type("number")
  legacy: number;

  @type("number")
  finance: number;

  @type("number")
  culture: number;

  @type("number")
  systemHealth: number;

  @type("number")
  victoryPoints: number;

  @type("string")
  effect: string;
}

export class AccomplishmentSet extends Schema implements AccomplishmentSetData<Accomplishment> {
  constructor(role: Role) {
    super();
    this.role = role;
    this.purchased = new ArraySchema<Accomplishment>();
    const deck = _.shuffle(getAccomplishmentIDs(role));
    const purchasableInds: Array<number> = deck.slice(0, 3);
    this.purchasable = new ArraySchema<Accomplishment>(
      ...purchasableInds.map(id => new Accomplishment(getAccomplishmentByID(role, id)))
    );
    this.deck = deck.slice(3);
  }

  fromJSON(data: AccomplishmentSetSerialized): void {
    this.role = data.role;
    const purchased = data.purchased.map(
      _id => new Accomplishment(getAccomplishmentByID(this.role, _id))
    );
    const purchasable = data.purchasable.map(
      _id => new Accomplishment(getAccomplishmentByID(this.role, _id))
    );
    this.purchased.splice(0, this.purchased.length, ...purchased);
    // this.purchasable.splice(0, this.purchasable.length, ...purchasable);
    this.purchasable.splice(0, this.purchasable.length);
    purchasable.forEach(p => this.purchasable.push(p));

    this.deck = data.remaining;
  }

  toJSON(): AccomplishmentSetSerialized {
    return {
      ...this.getAccomplishmentSetSummary(),
      remaining: this.deck,
      role: this.role,
    };
  }

  getAccomplishmentSetSummary(): AccomplishmentSetSummary {
    return {
      purchased: _.map(this.purchased, x => x.toJSON().id),
      purchasable: _.map(this.purchasable, x => x.toJSON().id),
    };
  }

  role: Role;

  @type([Accomplishment])
  purchased: ArraySchema<Accomplishment>;

  @type([Accomplishment])
  purchasable: ArraySchema<Accomplishment>;

  deck: Array<number>;

  purchase(accomplishment: AccomplishmentData): void {
    const accomplishmentIndex = this.purchasable.findIndex(
      (acc: Accomplishment) => acc.id === accomplishment.id
    );
    if (accomplishmentIndex > -1) {
      this.purchased.push(new Accomplishment(accomplishment));
      this.purchasable.splice(accomplishmentIndex, 1);
    }
  }

  discardPurchased(id: number): void {
    const discardedAccomplishmentIndex = this.purchased.findIndex(acc => acc.id === id);
    logger.info("Discarding purchased accomplishment [%d] from deck {%s}", id, this.purchased);
    if (discardedAccomplishmentIndex >= 0) {
      this.purchased.splice(discardedAccomplishmentIndex, 1);
      // make the discarded card available for purchase again
      this.deck.push(id);
    }
  }

  discardAll(): void {
    // discard into the bottom of the deck
    this.deck.push(...this.purchasable.map((card: Accomplishment) => card.id));
    this.purchasable.splice(0, this.purchasable.length);
  }

  discard(id: number): void {
    const index = this.purchasable.findIndex((card: Accomplishment) => card.id === id);
    if (index < 0) {
      return;
    }
    this.purchasable.splice(index, 1);
    this.deck.push(id);
  }

  draw(numberOfCards: number): void {
    for (let i = 0; i < numberOfCards; i++) {
      logger.debug("drawing an accomplishment from deck %s", this.deck);
      const accomplishmentId = this.deck.shift();
      const newAccomplishment = new Accomplishment(
        getAccomplishmentByID(this.role, accomplishmentId!)
      );
      this.purchasable.push(newAccomplishment);
    }
    assert.ok(this.purchasable.length <= 3, "Should never have more than 3 cards");
  }

  refreshPurchasableAccomplishments(): void {
    const numberOfAccomplishmentsToDraw = Math.min(3 - this.purchasable.length, this.deck.length);
    this.draw(numberOfAccomplishmentsToDraw);
  }

  peek(): number {
    return this.deck[0];
  }

  isPurchasable(accomplishment: AccomplishmentData): Accomplishment {
    return this.purchasable.find(a => a.id === accomplishment.id)!;
  }
}
