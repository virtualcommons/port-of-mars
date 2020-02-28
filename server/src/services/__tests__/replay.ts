import {GameState} from "@/rooms/game/state";
import {mockGameStateInitOpts} from "@/util";
import {
  EnteredInvestmentPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  StateSnapshotTaken,
  TimeInvested
} from "@/rooms/game/events";
import {CURATOR, Phase} from "shared/types";
import {toDBGameEvent} from "@/services/persistence";
import {GameReplayer} from "@/services/replay";

describe('a game replay', () => {
  const gs = new GameState(mockGameStateInitOpts());
  const ge = [
    new StateSnapshotTaken(gs.toJSON()),
    new TimeInvested({ role: CURATOR, investment: { upkeep: 2, culture: 2, finance: 0, government: 0, legacy: 0, science: 0}}),
    new EnteredTradePhase(),
    new EnteredPurchasePhase()
  ].map(e => toDBGameEvent(1, e));
  const gr = new GameReplayer(ge);

  it('should preserve all data of the original game play through', () => {
    const data = gr.summarize(g => ({ phase: g.phase, culture: g.players.Curator.inventory.culture }), g => g.phase);
    expect(data).toEqual([
      { phase: Phase.invest, culture: 0 },
      { phase: Phase.trade, culture: 2 },
      { phase: Phase.purchase, culture: 2}
    ]);
  });
});