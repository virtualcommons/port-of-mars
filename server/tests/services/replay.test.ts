import { GameState } from "@port-of-mars/server/rooms/game/state";
import { mockGameStateInitOpts } from "@port-of-mars/server/util";
import {
  EnteredDefeatPhase,
  EnteredDiscardPhase,
  EnteredInvestmentPhase,
  EnteredMarsEventPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  ExitedInvestmentPhase,
  ExitedPurchasePhase,
  ExitedTradePhase,
  PurchasedAccomplishment,
  TakenStateSnapshot,
  TimeInvested,
} from "@port-of-mars/server/rooms/game/events";
import { CURATOR, Phase, RESEARCHER } from "@port-of-mars/shared/types";
import {
  DBPersister,
  toDBGameEvent,
} from "@port-of-mars/server/services/persistence";
import { GameReplayer } from "@port-of-mars/server/services/replay";
import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";
import { Connection, EntityManager, QueryRunner } from "typeorm";
import { Persister } from "@port-of-mars/server/rooms/game/types";
import { ServiceProvider } from "@port-of-mars/server/services";
import {
  Player,
  Tournament,
  TournamentRound,
  TournamentRoundInvite,
  User,
} from "@port-of-mars/server/entity";
import { getAccomplishmentByID } from "@port-of-mars/server/data/Accomplishment";
import {
  createRound,
  createTournament,
  createTournamentRoundInvites,
  createUsers,
  initTransaction,
  rollbackTransaction,
} from "./common";

describe("a game", () => {
  const opts = mockGameStateInitOpts();
  const gs = new GameState(opts);
  // the first number represents the amount of time remaining in the phase when the
  // event occurs, we are setting it manually in the system
  const ges: Array<[number, GameEvent]> = [
    [60, new TakenStateSnapshot(gs.toJSON())],
    [40, new EnteredInvestmentPhase()],
    [
      200,
      new TimeInvested({
        role: CURATOR,
        investment: {
          systemHealth: 2,
          culture: 2,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [200, new ExitedInvestmentPhase()],
    [10, new EnteredTradePhase()],
    [5, new ExitedTradePhase()],
    [5, new EnteredPurchasePhase()],
    [
      285,
      new PurchasedAccomplishment({
        accomplishment: getAccomplishmentByID(RESEARCHER, 1),
        role: RESEARCHER,
      }),
    ],
    [15, new ExitedPurchasePhase()],
    [15, new EnteredDiscardPhase()],
    [30, new EnteredMarsEventPhase()],
    [5, new EnteredDefeatPhase({ ...gs.playerScores, Researcher: 5 })],
  ];

  describe("event stream", () => {
    let conn: Connection;
    let manager: EntityManager;
    let persister: Persister;
    let qs: QueryRunner;
    let sp: ServiceProvider;
    let t: Tournament;
    let tr: TournamentRound;
    let invites: Array<TournamentRoundInvite>;
    let users: Array<User>;

    beforeAll(async () => {
      [conn, qs, manager] = await initTransaction();
      sp = new ServiceProvider(manager);
      persister = new DBPersister(sp);
      t = await createTournament(sp);
      tr = await createRound(sp, { tournamentId: t.id });

      // mock game state init opts wants five users with bob in the username
      users = await createUsers(manager, "bob", [1, 2, 3, 4, 5]);
      invites = await createTournamentRoundInvites(sp, {
        userIds: users.map((u) => u.id),
        tournamentRoundId: tr.id,
      });
    });

    it("can be loaded into the database and finalized", async () => {
      const gameId = await persister.initialize(
        { tournamentRoundId: tr.id, ...opts },
        "foo",
        true
      );
      for (const [endTime, e] of ges) {
        await persister.persist([e], {
          gameId,
          dateCreated: new Date("1970 01 01"),
          timeRemaining: endTime,
        });
      }
      await persister.sync();
      await persister.finalize(gameId, true);
      const players = await manager
        .getRepository(Player)
        .find({ where: { gameId } });
      expect(players.length).toBe(5);
      for (const p of players) {
        if (p.role === RESEARCHER) {
          expect(p.points).toBe(5);
        } else {
          expect(p.points).toBe(0);
        }
      }
      for (const invite of invites) {
        const refreshedInvite = await manager
          .getRepository(TournamentRoundInvite)
          .findOneOrFail(invite.id);
        expect(refreshedInvite.hasParticipated).toBeTruthy();
      }
    });

    afterAll(async () => rollbackTransaction(conn, qs));
  });

  it("should preserve all data of the original game play through", () => {
    const gr = new GameReplayer(
      ges.map(([timeRemaining, e]) =>
        toDBGameEvent(e, { gameId: 1, timeRemaining, dateCreated: new Date(jest.getRealSystemTime()) })
      )
    );
    const data = gr.summarize((g) => ({
      phase: g.phase,
      culture: g.players.Curator.inventory.culture,
      points: g.players.Researcher.victoryPoints,
    }));
    // FIXME: we want to ensure that the durations of the persisted data match up with when the events occurred
    // however, it is challenging to properly compute these based on the ges array above without a bunch of
    // additional special casing, so for now we are hard coding the durations
    expect(data).toEqual([
      // new round phase lasted 20 seconds between taken state snapshot and entered investment phase
      { phase: Phase.newRound, culture: 0, duration: 20, points: 0 },
      // investment lasted 170 seconds, going from 180 seconds to 10 seconds to enter the trade phase
      { phase: Phase.invest, culture: 2, duration: 170, points: 0 },
      // trade phase lasts 175 seconds, going from 180 seconds to 5 seconds exiting the trade phase
      { phase: Phase.trade, culture: 2, duration: 175, points: 0 },
      // purchase phase lasts 45 seconds going from 60 seconds to 15 seconds exiting the purchase phase / entering the discard phase
      { phase: Phase.purchase, culture: 2, duration: 45, points: 5 },
      // discard phase lasts 30 seconds going from 60 seconds to 30 seconds exiting the discard phase (entering the mars event phase again)
      { phase: Phase.discard, culture: 2, duration: 30, points: 5 },
      // FIXME: this duration depends on the specific MarsEvent that was persisted, some events may have 10s, others 300s
      // regardless, transition occurs with 5s left in the phase, so should be MarsEvent.duration - 5
      { phase: Phase.events, culture: 2, duration: 5, points: 5 },
      { phase: Phase.defeat, culture: 2, duration: 0, points: 5 },
    ]);
  });
});
