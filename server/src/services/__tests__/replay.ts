import {GameState} from "@port-of-mars/server/rooms/game/state";
import {mockGameStateInitOpts} from "@port-of-mars/server/util";
import {
  EnteredInvestmentPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  TakenStateSnapshot,
  TimeInvested
} from "@port-of-mars/server/rooms/game/events";
import {CURATOR, Phase} from "@port-of-mars/shared/types";
import {toDBGameEvent} from "@port-of-mars/server/services/persistence";
import {GameReplayer} from "@port-of-mars/server/services/replay";

describe('a game replay', () => {
  const gs = new GameState(mockGameStateInitOpts());
  const ge = [
    new TakenStateSnapshot(300, gs.toJSON()),
    new TimeInvested(200, { role: CURATOR, investment: { upkeep: 2, culture: 2, finance: 0, government: 0, legacy: 0, science: 0}}),
    new EnteredTradePhase(10),
    new EnteredPurchasePhase(5)
  ].map(e => toDBGameEvent(1, e));
  const gr = new GameReplayer(ge);

  it('should preserve all data of the original game play through', () => {
    const data = gr.summarize(g => ({ phase: g.phase, culture: g.players.Curator.inventory.culture }));
    expect(data).toEqual([
      { phase: Phase.invest, culture: 0, duration: 290 },
      { phase: Phase.trade, culture: 2, duration: 295 },
      { phase: Phase.purchase, culture: 2, duration: 0 },
    ]);
  });
});