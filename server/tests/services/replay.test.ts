import { GameState } from "@port-of-mars/server/rooms/pom/game/state";
import { mockGameStateInitOpts } from "@port-of-mars/server/util";
import {
  AcceptedTradeRequest,
  AddedSystemHealthContributions,
  DiscardedAccomplishment,
  EnteredDefeatPhase,
  EnteredDiscardPhase,
  EnteredInvestmentPhase,
  EnteredMarsEventPhase,
  EnteredNewRoundPhase,
  EnteredPurchasePhase,
  EnteredTradePhase,
  ExitedInvestmentPhase,
  ExitedMarsEventPhase,
  ExitedPurchasePhase,
  ExitedTradePhase,
  InitializedMarsEvent,
  PurchasedAccomplishment,
  ReenteredMarsEventPhase,
  SentChatMessage,
  SentTradeRequest,
  SubtractedSystemHealthWearAndTear,
  TakenStateSnapshot,
  TimeInvested,
} from "@port-of-mars/server/rooms/pom/game/events";
import {
  CURATOR,
  ENTREPRENEUR,
  Phase,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
} from "@port-of-mars/shared/types";
import { DBPersister, toDBGameEvent } from "@port-of-mars/server/services/persistence";
import { GameReplayer, MarsEventSummarizer } from "@port-of-mars/server/services/replay";
import { GameEvent } from "@port-of-mars/server/rooms/pom/game/events/types";
import { EntityManager, QueryRunner } from "typeorm";
import { Persister } from "@port-of-mars/server/rooms/pom/game/types";
import { ServiceProvider } from "@port-of-mars/server/services";
import { Player, Tournament, TournamentRound, User } from "@port-of-mars/server/entity";
import { getAccomplishmentByID } from "@port-of-mars/server/data/Accomplishment";
import {
  createRound,
  createTournament,
  createUsers,
  initTransaction,
  rollbackTransaction,
} from "../common";
import { getFixedMarsEventDeck } from "@port-of-mars/server/rooms/pom/game/state/marsevents/common";

describe("a game", () => {
  const opts = mockGameStateInitOpts();
  const gs = new GameState(opts);
  const DEFAULT_DURATIONS = GameState.DEFAULT_PHASE_DURATION;
  const TIME_ENTERED = {
    [Phase.newRound]: 10,
    [Phase.events]: 30,
    [Phase.invest]: 4,
    [Phase.trade]: 10,
    [Phase.purchase]: 5,
    [Phase.discard]: 15,
    [Phase.defeat]: 3,
  };
  // the first number represents the amount of time remaining in the phase when the
  // event occurs, we are setting it manually in the system
  const ges: Array<[number, GameEvent]> = [
    // round 1 | NEW ROUND phase 1/6 ===============================================================
    [60, new TakenStateSnapshot(gs.toJSON())],
    [50, new SentChatMessage({ role: PIONEER, round: 1, message: "hello world", dateCreated: 0 })],
    [45, new SentChatMessage({ role: PIONEER, round: 1, message: "hi", dateCreated: 0 })],
    [41, new SubtractedSystemHealthWearAndTear()],
    [TIME_ENTERED[Phase.invest], new EnteredInvestmentPhase()],
    // round 1 | INVEST phase (3/6) - no mars events round 1 =======================================
    [
      160,
      new TimeInvested({
        role: CURATOR,
        investment: {
          systemHealth: 6,
          culture: 2,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [
      160,
      new TimeInvested({
        role: ENTREPRENEUR,
        investment: {
          systemHealth: 4,
          culture: 0,
          finance: 3,
          government: 0,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [
      160,
      new TimeInvested({
        role: RESEARCHER,
        investment: {
          systemHealth: 8,
          culture: 0,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 1,
        },
      }),
    ],
    [
      160,
      new TimeInvested({
        role: PIONEER,
        investment: {
          systemHealth: 10,
          culture: 0,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [
      160,
      new TimeInvested({
        role: POLITICIAN,
        investment: {
          systemHealth: 2,
          culture: 0,
          finance: 0,
          government: 4,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [140, new ExitedInvestmentPhase()],
    [TIME_ENTERED[Phase.trade], new EnteredTradePhase()],
    // round 1 | TRADE phase 4/6 ===================================================================
    [
      50,
      new SentTradeRequest({
        // entrepreneur asks for 2 culture for 1 finance from curator
        id: "foo",
        sender: {
          role: ENTREPRENEUR,
          resourceAmount: { culture: 0, finance: 1, government: 0, legacy: 0, science: 0 },
        },
        recipient: {
          role: CURATOR,
          resourceAmount: { culture: 2, finance: 0, government: 0, legacy: 0, science: 0 },
        },
        status: "Active",
      }),
    ],
    [45, new AcceptedTradeRequest({ id: "foo" })], // curator accepts
    [5, new ExitedTradePhase()],
    [TIME_ENTERED[Phase.purchase], new EnteredPurchasePhase()],
    // round 1 | PURCHASE phase 5/6 ================================================================
    [
      285,
      new PurchasedAccomplishment({
        // researcher gets 3 points, -6 system health
        accomplishment: getAccomplishmentByID(RESEARCHER, 14),
        role: RESEARCHER,
      }),
    ],
    [
      275,
      new PurchasedAccomplishment({
        // entrepreneur gets 4 points
        accomplishment: getAccomplishmentByID(ENTREPRENEUR, 45),
        role: ENTREPRENEUR,
      }),
    ],
    [15, new ExitedPurchasePhase()],
    [TIME_ENTERED[Phase.discard], new EnteredDiscardPhase()],
    // round 1 | DISCARD phase 6/6 =================================================================
    [
      11,
      new DiscardedAccomplishment({
        role: CURATOR,
        id: gs.players.Curator.accomplishments.purchasable[0].id,
      }),
    ],
    [10, new AddedSystemHealthContributions()],
    [TIME_ENTERED[Phase.newRound], new EnteredNewRoundPhase()],
    // round 2 | NEW ROUND phase 1/6 ===============================================================
    [40, new SubtractedSystemHealthWearAndTear()],
    [TIME_ENTERED[Phase.events], new EnteredMarsEventPhase()],
    // round 2 | MARS EVENTS phase 2/5 =============================================================
    [7, new InitializedMarsEvent()],
    [5, new ExitedMarsEventPhase()],
    [TIME_ENTERED[Phase.invest], new EnteredInvestmentPhase()],
    // round 2 | INVEST phase 3/5 =============================================================
    [
      150,
      new TimeInvested({
        role: CURATOR,
        investment: {
          systemHealth: 2,
          culture: 4,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [
      150,
      new TimeInvested({
        role: ENTREPRENEUR,
        investment: {
          systemHealth: 2,
          culture: 0,
          finance: 4,
          government: 0,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [
      150,
      new TimeInvested({
        role: RESEARCHER,
        investment: {
          systemHealth: 2,
          culture: 0,
          finance: 0,
          government: 0,
          legacy: 0,
          science: 4,
        },
      }),
    ],
    [
      150,
      new TimeInvested({
        role: PIONEER,
        investment: {
          systemHealth: 2,
          culture: 0,
          finance: 0,
          government: 0,
          legacy: 4,
          science: 0,
        },
      }),
    ],
    [
      150,
      new TimeInvested({
        role: POLITICIAN,
        investment: {
          systemHealth: 2,
          culture: 0,
          finance: 0,
          government: 4,
          legacy: 0,
          science: 0,
        },
      }),
    ],
    [140, new ExitedInvestmentPhase()],
    [TIME_ENTERED[Phase.trade], new EnteredTradePhase()],
    // round 2 | TRADE phase 4/5 =============================================================
    [5, new ExitedTradePhase()],
    [TIME_ENTERED[Phase.purchase], new EnteredPurchasePhase()],
    // round 2 | PURCHASE phase 5/6 ================================================================
    [15, new ExitedPurchasePhase()],
    [TIME_ENTERED[Phase.discard], new EnteredDiscardPhase()],
    // round 2 | DISCARD phase 6/6 =================================================================
    [10, new AddedSystemHealthContributions()],
    [TIME_ENTERED[Phase.newRound], new EnteredNewRoundPhase()],
    // round 3 | NEW ROUND phase 1/6 ===============================================================
    [40, new SubtractedSystemHealthWearAndTear()],
    [TIME_ENTERED[Phase.events], new EnteredMarsEventPhase()],
    // round 3 | MARS EVENTS phase 2/5 =============================================================
    [45, new InitializedMarsEvent()],
    [40, new ReenteredMarsEventPhase()],
    [35, new InitializedMarsEvent()],
    [5, new ExitedMarsEventPhase()],
    // game end
    [
      TIME_ENTERED[Phase.defeat],
      new EnteredDefeatPhase({
        ...gs.playerScores,
        Researcher: getAccomplishmentByID(RESEARCHER, 14).victoryPoints,
        Entrepreneur: getAccomplishmentByID(ENTREPRENEUR, 45).victoryPoints,
      }),
    ],
  ];

  describe("event stream", () => {
    let manager: EntityManager;
    let persister: Persister;
    let qr: QueryRunner;
    let sp: ServiceProvider;
    let t: Tournament;
    let tr: TournamentRound;
    // let invites: Array<TournamentRoundInvite>;
    let users: Array<User>;

    beforeAll(async () => {
      [qr, manager] = await initTransaction();
      sp = new ServiceProvider(manager);
      persister = new DBPersister(sp);
      t = await createTournament(sp);
      tr = await createRound(sp, { tournamentId: t.id });

      // mock game state init opts wants five users with bob in the username
      users = await createUsers(manager, "bob", [1, 2, 3, 4, 5]);
      // invites = await createTournamentRoundInvites(sp, {
      //   userIds: users.map(u => u.id),
      //   tournamentRoundId: tr.id,
      // });
    });

    it("can be loaded into the database and finalized", async () => {
      const gameId = await persister.initialize({ tournamentRoundId: tr.id, ...opts }, "foo", true);
      for (const [endTime, e] of ges) {
        await persister.persist([e], {
          gameId,
          dateCreated: new Date("1970 01 01"),
          timeRemaining: endTime,
        });
      }
      await persister.sync();
      await persister.finalize(gameId, true);
      const players = await manager.getRepository(Player).find({ where: { gameId } });
      expect(players.length).toBe(5);
      for (const p of players) {
        if (p.role === RESEARCHER) {
          expect(p.points).toBe(getAccomplishmentByID(RESEARCHER, 14).victoryPoints);
        } else if (p.role === ENTREPRENEUR) {
          expect(p.points).toBe(getAccomplishmentByID(ENTREPRENEUR, 45).victoryPoints);
        } else {
          expect(p.points).toBe(0);
        }
      }
    });

    afterAll(async () => rollbackTransaction(qr));
  });

  it("correctly isolates all mars events", () => {
    const dbEvents = ges.map(([timeRemaining, e]) =>
      toDBGameEvent(e, {
        gameId: 1,
        timeRemaining,
        dateCreated: new Date(jest.getRealSystemTime()),
      })
    );
    const eventSummarizer = new MarsEventSummarizer(dbEvents, "foo.bar");
    const data = eventSummarizer._summarizeGame(dbEvents).map(e => e.name);
    const events = getFixedMarsEventDeck();
    expect(data.length).toBe(3);
    for (const [i, e] of data.entries()) {
      expect(e).toEqual(events[i].name);
    }
  });

  it("should preserve all data of the original game play through", () => {
    const gr = new GameReplayer(
      ges.map(([timeRemaining, e]) =>
        toDBGameEvent(e, {
          gameId: 1,
          timeRemaining,
          dateCreated: new Date(jest.getRealSystemTime()),
        })
      )
    );
    const data = gr.summarize(g => ({
      phase: g.phase,
      culture: g.players.Curator.inventory.culture,
      points: [g.players.Researcher.victoryPoints, g.players.Entrepreneur.victoryPoints],
      health: g.systemHealth,
      currentEvent: g.currentEvent?.id,
    }));
    const events = getFixedMarsEventDeck();
    expect(data).toEqual([
      // ROUND 1 ==============================================
      {
        phase: Phase.newRound,
        culture: 0,
        duration: DEFAULT_DURATIONS[Phase.newRound] - TIME_ENTERED[Phase.invest],
        points: [0, 0],
        health: 75,
        currentEvent: undefined,
      },
      {
        phase: Phase.invest,
        culture: 2,
        duration: DEFAULT_DURATIONS[Phase.invest] - TIME_ENTERED[Phase.trade],
        points: [0, 0],
        health: 75,
        currentEvent: undefined,
      },
      {
        phase: Phase.trade,
        culture: 0,
        duration: DEFAULT_DURATIONS[Phase.trade] - TIME_ENTERED[Phase.purchase],
        points: [0, 0],
        health: 75,
        currentEvent: undefined,
      },
      {
        phase: Phase.purchase,
        culture: 0,
        duration: DEFAULT_DURATIONS[Phase.purchase] - TIME_ENTERED[Phase.discard],
        points: [3, 4], // points gained from accomplishments
        health: 75,
        currentEvent: undefined,
      },
      {
        phase: Phase.discard,
        culture: 0,
        duration: DEFAULT_DURATIONS[Phase.discard] - TIME_ENTERED[Phase.newRound],
        points: [3, 4],
        health: 75 + 30 - 6, // 30 invested into system health, 6 subtracted from accomplishment
        currentEvent: undefined,
      },
      // ROUND 2 ==============================================
      {
        phase: Phase.newRound,
        culture: 0,
        duration: DEFAULT_DURATIONS[Phase.newRound] - TIME_ENTERED[Phase.events],
        points: [3, 4],
        health: 75 + 30 - 6 - 25, // 25 system health lost from wear and tear
        currentEvent: undefined,
      },
      {
        phase: Phase.events,
        culture: 0,
        duration:
          (events[0].timeDuration ?? DEFAULT_DURATIONS[Phase.events]) - TIME_ENTERED[Phase.invest],
        points: [3, 4],
        health: 75 + 30 - 6 - 25,
        currentEvent: events[0].id, // one event is processed
      },
      {
        phase: Phase.invest,
        culture: 4, // curator buys 4 culture
        duration: DEFAULT_DURATIONS[Phase.invest] - TIME_ENTERED[Phase.trade],
        points: [3, 4],
        health: 75 + 30 - 6 - 25,
        currentEvent: events[0].id,
      },
      {
        phase: Phase.trade,
        culture: 4,
        duration: DEFAULT_DURATIONS[Phase.trade] - TIME_ENTERED[Phase.purchase],
        points: [3, 4],
        health: 75 + 30 - 6 - 25,
        currentEvent: events[0].id,
      },
      {
        phase: Phase.purchase,
        culture: 4,
        duration: DEFAULT_DURATIONS[Phase.purchase] - TIME_ENTERED[Phase.discard],
        points: [3, 4],
        health: 75 + 30 - 6 - 25,
        currentEvent: events[0].id,
      },
      {
        phase: Phase.discard,
        culture: 4,
        duration: DEFAULT_DURATIONS[Phase.discard] - TIME_ENTERED[Phase.newRound],
        points: [3, 4],
        health: 75 + 30 - 6 - 25 + 10, // 10 total invested into system health
        currentEvent: events[0].id,
      },
      // ROUND 3 ==============================================
      {
        phase: Phase.newRound,
        culture: 4,
        duration: DEFAULT_DURATIONS[Phase.newRound] - TIME_ENTERED[Phase.events],
        points: [3, 4],
        health: 75 + 30 - 6 - 25 + 10 - 25, // 25 system health lost from wear and tear
        currentEvent: events[0].id,
      },
      {
        phase: Phase.events,
        culture: 4,
        duration:
          (events[2].timeDuration ?? DEFAULT_DURATIONS[Phase.events]) - TIME_ENTERED[Phase.defeat],
        points: [3, 4],
        health: 75 + 30 - 6 - 25 + 10 - 25,
        currentEvent: events[2].id, // 2 more mars events processed for 3 total
      },
      {
        phase: Phase.defeat,
        culture: 4,
        duration: 0,
        points: [3, 4],
        health: 75 + 30 - 6 - 25 + 10 - 25,
        currentEvent: events[2].id,
      },
    ]);
  });
});
