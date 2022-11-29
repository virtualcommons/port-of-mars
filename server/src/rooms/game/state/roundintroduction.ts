import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { RoundIntroductionData } from "@port-of-mars/shared/types";
import _ from "lodash";
import { SYSTEM_HEALTH_MAINTENANCE_COST } from "@port-of-mars/shared/settings";
import { Player } from "@port-of-mars/server/rooms/game/state/player";
import { SystemHealthMarsEvent } from "@port-of-mars/server/rooms/game/state/systemhealth";
import { AccomplishmentPurchase } from "@port-of-mars/server/rooms/game/state/accomplishment"
import { Trade } from "@port-of-mars/server/rooms/game/state/trade"

export class RoundIntroduction
  extends Schema
  implements
    RoundIntroductionData<SystemHealthMarsEvent, AccomplishmentPurchase, Trade>
{
  constructor() {
    super();
  }

  fromJSON(data: RoundIntroductionData): void {
    this.systemHealthMaintenanceCost = data.systemHealthMaintenanceCost;
    // FIXME: data.systemHealthGroupContributions does not exist in earlier games
    // and causes data export to fail for previous tournaments
    for (const [key, value] of Object.entries(data.systemHealthGroupContributions)) {
      this.systemHealthGroupContributions.set(key, value);
    }
    this.systemHealthMarsEvents.splice(
      0,
      this.systemHealthMarsEvents.length,
      ...data.systemHealthMarsEvents.map((d) => new SystemHealthMarsEvent(d))
    );
    this.accomplishmentPurchases.splice(
      0,
      this.accomplishmentPurchases.length,
      ...data.accomplishmentPurchases.map(
        (ap) => new AccomplishmentPurchase(ap)
      )
    );
    this.completedTrades.splice(
      0,
      this.completedTrades.length,
      ...data.completedTrades.map(
        (ct) => new Trade(ct.id, ct.sender, ct.recipient, ct.status)
      )
    );
  }

  toJSON(): RoundIntroductionData {
    return {
      systemHealthGroupContributions: this.systemHealthGroupContributions.toJSON(),
      systemHealthAtStartOfRound: this.systemHealthAtStartOfRound,
      systemHealthMarsEvents: this.systemHealthMarsEvents.map((e) =>
        e.toJSON()
      ),
      systemHealthMaintenanceCost: this.systemHealthMaintenanceCost,
      accomplishmentPurchases: this.accomplishmentPurchases.map((ap) =>
        ap.toJSON()
      ),
      completedTrades: this.completedTrades.map((ct) => ct.toJSON()),
    };
  }

  @type("number")
  systemHealthMaintenanceCost = -SYSTEM_HEALTH_MAINTENANCE_COST;

  @type({ map: "number" })
  systemHealthGroupContributions = new MapSchema<number>();

  @type("number")
  systemHealthAtStartOfRound = 100;

  @type([SystemHealthMarsEvent])
  systemHealthMarsEvents = new ArraySchema<SystemHealthMarsEvent>();

  @type([AccomplishmentPurchase])
  accomplishmentPurchases = new ArraySchema<AccomplishmentPurchase>();

  @type([Trade])
  completedTrades = new ArraySchema<Trade>();

  updateSystemHealthGroupContributions(players: Array<Player>): void {
    for (const p of players) {
      this.systemHealthGroupContributions.set(p.role, p.systemHealthChanges.investment);
    }
  }

  setSystemHealthAtStartOfRound(systemHealth: number): void {
    this.systemHealthAtStartOfRound = systemHealth;
  }

  addSystemHealthMarsEvent(event: SystemHealthMarsEvent): void {
    this.systemHealthMarsEvents.push(event);
  }

  addAccomplishmentPurchase(accomplishment: AccomplishmentPurchase): void {
    this.accomplishmentPurchases.push(accomplishment);
  }

  addCompletedTrade(trade: Trade) {
    // FIXME: no-op for now, need to implement clone
    // this.completedTrades.push(trade.clone());
  }

  /**
   * Invoked at the time that wear and tear is calculated and applied to the system health, currently at the end of each round.
   * @param systemHealthAtStartOfRound
   */
  initialize(systemHealthAtStartOfRound: number): void {
    this.systemHealthGroupContributions.forEach((value, key) => this.systemHealthGroupContributions.set(key, 0));
    this.systemHealthAtStartOfRound = systemHealthAtStartOfRound;
    this.accomplishmentPurchases.splice(0, this.accomplishmentPurchases.length);
    this.completedTrades.splice(0, this.completedTrades.length);
    this.systemHealthMarsEvents.splice(0, this.systemHealthMarsEvents.length);
  }
}