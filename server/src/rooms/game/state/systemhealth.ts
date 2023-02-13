import { ArraySchema, Schema, type } from "@colyseus/schema";
import {
  SystemHealthChangesData,
  PurchasedSystemHealthData,
  SystemHealthMarsEventData,
} from "@port-of-mars/shared/types";

export class SystemHealthMarsEvent extends Schema implements SystemHealthMarsEventData {
  @type("string")
  label: string;

  @type("number")
  systemHealthModification: number;

  constructor(data: SystemHealthMarsEventData) {
    super();
    this.label = data.label;
    this.systemHealthModification = data.systemHealthModification;
  }

  fromJSON(data: SystemHealthMarsEventData): void {
    this.label = data.label;
    this.systemHealthModification = data.systemHealthModification;
  }

  toJSON(): SystemHealthMarsEventData {
    return {
      label: this.label,
      systemHealthModification: this.systemHealthModification,
    };
  }
}

export class PurchasedSystemHealth extends Schema implements PurchasedSystemHealthData {
  constructor(data: PurchasedSystemHealthData) {
    super();
    this.description = data.description;
    this.systemHealth = data.systemHealth;
  }

  fromJSON(data: PurchasedSystemHealthData): void {
    this.description = data.description;
    this.systemHealth = data.systemHealth;
  }

  toJSON(): PurchasedSystemHealthData {
    return {
      description: this.description,
      systemHealth: this.systemHealth,
    };
  }

  @type("string")
  description: string;

  @type("number")
  systemHealth: number;
}

/**
 * Maintained to display the system health report state at the beginning of a round on the client
 */
export class SystemHealthChanges
  extends Schema
  implements SystemHealthChangesData<PurchasedSystemHealth>
{
  fromJSON(data: SystemHealthChangesData): void {
    this.investment = data.investment;
    this.purchases.splice(
      this.purchases.length,
      0,
      ...data.purchases.map(p => new PurchasedSystemHealth(p))
    );
  }

  toJSON(): SystemHealthChangesData {
    return {
      investment: this.investment,
      purchases: this.purchases.map(p => ({
        description: p.description,
        systemHealth: p.systemHealth,
      })),
    };
  }

  addPurchase(purchase: PurchasedSystemHealth): void {
    this.purchases.push(purchase);
  }

  reset(): void {
    this.investment = 0;
    this.purchases.splice(0, this.purchases.length);
  }

  netChange(): number {
    let netSystemChange = this.investment;
    for (const purchase of this.purchases) {
      netSystemChange += purchase.systemHealth;
    }
    return netSystemChange;
  }

  @type("number")
  investment = 0;

  @type([PurchasedSystemHealth])
  purchases = new ArraySchema<PurchasedSystemHealth>();
}
