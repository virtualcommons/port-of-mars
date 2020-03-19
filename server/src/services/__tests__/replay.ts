import {GameState} from "@port-of-mars/server/rooms/game/state";
import {mockGameStateInitOpts} from "@port-of-mars/server/util";
import {
  EnteredDefeatPhase,
  EnteredDiscardPhase,
  EnteredInvestmentPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  TakenStateSnapshot,
  TimeInvested
} from "@port-of-mars/server/rooms/game/events";
import {CURATOR, Phase} from "@port-of-mars/shared/types";
import {toDBGameEvent} from "@port-of-mars/server/services/persistence";
import {GameReplayer} from "@port-of-mars/server/services/replay";
import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";

describe('a game replay', () => {
  const gs = new GameState(mockGameStateInitOpts());
  const ge: Array<[number, GameEvent]> = [
    [300, new TakenStateSnapshot(gs.toJSON())],
    [200, new TimeInvested({ role: CURATOR, investment: { upkeep: 2, culture: 2, finance: 0, government: 0, legacy: 0, science: 0}})],
    [ 10, new EnteredTradePhase()],
    [  5, new EnteredPurchasePhase()],
    [ 15, new EnteredDiscardPhase()],
    [ 60, new EnteredDefeatPhase()]
  ];
  const gr = new GameReplayer(ge.map(([timeRemaining, e]) =>
    toDBGameEvent(e, { gameId: 1, timeRemaining, dateCreated: new Date()})));

  it('should preserve all data of the original game play through', () => {
    const data = gr.summarize(g => ({ phase: g.phase, culture: g.players.Curator.inventory.culture }));
    expect(data).toEqual([
      { phase: Phase.invest, culture: 0, duration: 290 },
      { phase: Phase.trade, culture: 2, duration: 295 },
      { phase: Phase.purchase, culture: 2, duration: 285 },
      { phase: Phase.discard, culture: 2, duration: 0 },
    ]);
  });
});