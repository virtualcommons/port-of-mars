import { Schema, type } from "@colyseus/schema";
import {
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
  InvestmentData,
  Resource,
  ResourceAmountData,
  ResourceCostData,
  Role,
} from "@port-of-mars/shared/types";
import _ from "lodash";
import { COST_INAFFORDABLE } from "@port-of-mars/shared/settings";

export class ResourceInventory extends Schema implements ResourceAmountData {
  constructor() {
    super();
    this.culture = 0;
    this.finance = 0;
    this.government = 0;
    this.legacy = 0;
    this.science = 0;
  }

  fromJSON(data: ResourceAmountData) {
    Object.assign(this, data);
  }

  toJSON(): ResourceAmountData {
    return {
      culture: this.culture,
      finance: this.finance,
      government: this.government,
      legacy: this.legacy,
      science: this.science,
    };
  }

  @type("number")
  culture: number;

  @type("number")
  finance: number;

  @type("number")
  government: number;

  @type("number")
  legacy: number;

  @type("number")
  science: number;

  canAfford(inventory: ResourceAmountData): boolean {
    for (const [k, v] of Object.entries(this)) {
      const resourceRemaining: number = (v as any) - (inventory as any)[k];
      if (resourceRemaining < 0) {
        return false;
      }
    }
    return true;
  }

  add(newResources: ResourceAmountData) {
    this.culture += newResources.culture;
    this.finance += newResources.finance;
    this.government += newResources.government;
    this.legacy += newResources.legacy;
    this.science += newResources.science;
  }

  setToZero(resource: Resource) {
    this[resource] = 0;
  }
}

export class ResourceCosts extends Schema implements ResourceCostData {
  constructor(costs: ResourceCostData) {
    super();
    this.culture = costs.culture;
    this.finance = costs.finance;
    this.government = costs.government;
    this.legacy = costs.legacy;
    this.science = costs.science;
    this.systemHealth = costs.systemHealth;
  }

  fromJSON(data: ResourceCostData) {
    Object.assign(this, data);
  }

  toJSON(): ResourceCostData {
    return {
      culture: this.culture,
      finance: this.finance,
      government: this.government,
      legacy: this.legacy,
      science: this.science,
      systemHealth: this.systemHealth,
    };
  }

  static getCosts(role: Role): ResourceCostData {
    switch (role) {
      case CURATOR:
        return {
          culture: 2,
          finance: 3,
          government: COST_INAFFORDABLE,
          legacy: 3,
          science: COST_INAFFORDABLE,
          systemHealth: 1,
          // specialty: 'culture'
        };
      case ENTREPRENEUR:
        return {
          culture: 3,
          finance: 2,
          government: 3,
          legacy: COST_INAFFORDABLE,
          science: COST_INAFFORDABLE,
          systemHealth: 1,
          // specialty: 'finance'
        };
      case PIONEER:
        return {
          culture: 3,
          finance: COST_INAFFORDABLE,
          government: COST_INAFFORDABLE,
          legacy: 2,
          science: 3,
          systemHealth: 1,
          // specialty: 'legacy'
        };
      case POLITICIAN:
        return {
          culture: COST_INAFFORDABLE,
          finance: 3,
          government: 2,
          legacy: COST_INAFFORDABLE,
          science: 3,
          systemHealth: 1,
          // specialty: 'government'
        };
      case RESEARCHER:
        return {
          culture: COST_INAFFORDABLE,
          finance: COST_INAFFORDABLE,
          government: 3,
          legacy: 3,
          science: 2,
          systemHealth: 1,
          // specialty: 'science'
        };
    }
  }

  static senderRole(role: Role): ResourceCosts {
    return new ResourceCosts(ResourceCosts.getCosts(role));
  }

  static getSpecialty(role: Role): Resource {
    switch (role) {
      case CURATOR:
        return "culture";
      case ENTREPRENEUR:
        return "finance";
      case PIONEER:
        return "legacy";
      case POLITICIAN:
        return "government";
      case RESEARCHER:
        return "science";
    }
  }

  @type("number")
  culture: number;

  @type("number")
  finance: number;

  @type("number")
  government: number;

  @type("number")
  legacy: number;

  @type("number")
  science: number;

  @type("number")
  systemHealth: number;

  investmentWithinBudget(investment: InvestmentData, budget: number) {
    return (
      this.culture * investment.culture +
        this.finance * investment.finance +
        this.government * investment.government +
        this.legacy * investment.legacy +
        this.science * investment.science +
        this.systemHealth * investment.systemHealth <=
      budget
    );
  }
}
