import {GameState} from "@port-of-mars/server/rooms/game/state";
import {mockGameStateInitOpts} from "@port-of-mars/server/util";
import {
  EnteredDefeatPhase,
  EnteredDiscardPhase,
  EnteredInvestmentPhase, EnteredMarsEventPhase,
  EnteredPurchasePhase,
  EnteredTradePhase, PurchasedAccomplishment,
  TakenStateSnapshot,
  TimeInvested
} from "@port-of-mars/server/rooms/game/events";
import {CURATOR, Phase, RESEARCHER} from "@port-of-mars/shared/types";
import {DBPersister, toDBGameEvent} from "@port-of-mars/server/services/persistence";
import {GameReplayer} from "@port-of-mars/server/services/replay";
import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";
import {Connection, createConnection, EntityManager, getConnection, QueryRunner} from "typeorm";
import {Persister} from "@port-of-mars/server/rooms/game/types";
import {ServiceProvider} from "@port-of-mars/server/services";
import {Player, Tournament, TournamentRound, User} from "@port-of-mars/server/entity";
import {getAccomplishmentByID} from "@port-of-mars/server/data/Accomplishment";

describe('a game', () => {
  const opts = mockGameStateInitOpts();
  const gs = new GameState(opts);
  const ges: Array<[number, GameEvent]> = [
    [300, new TakenStateSnapshot(gs.toJSON())],
    [200, new TimeInvested({
      role: CURATOR,
      investment: {upkeep: 2, culture: 2, finance: 0, government: 0, legacy: 0, science: 0}
    })],
    [10, new EnteredTradePhase()],
    [5, new EnteredPurchasePhase()],
    [285, new PurchasedAccomplishment({accomplishment: getAccomplishmentByID(RESEARCHER, 1), role: RESEARCHER})],
    [15, new EnteredDiscardPhase()],
    [30, new EnteredMarsEventPhase()],
    [60, new EnteredDefeatPhase({ ...gs.playerScores, Researcher: 5})]
  ];

  describe('event stream', () => {
    let conn: Connection;
    let manager: EntityManager;
    let persister: Persister;
    let qs: QueryRunner;
    let sp: ServiceProvider;
    let t: Tournament;
    let tr: TournamentRound;
    let users: Array<User>;

    beforeAll(async () => {
      conn = await createConnection('test');
      qs = conn.createQueryRunner();
      await qs.startTransaction();
      manager = qs.manager;
      persister = new DBPersister(manager);
      sp = new ServiceProvider(manager);
      t = await sp.tournament.createTournament({name: 'First', active: true});
      tr = await sp.tournament.createRound({
        exitSurveyUrl: '',
        introSurveyUrl: '',
        startDate: new Date('1970 01 01'),
        endDate: new Date('1970 01 03'),
        roundNumber: 1,
        tournamentId: t.id
      });
      const userRepo = manager.getRepository(User);
      // mock game state init opts wants five users with bob in the username
      users = await userRepo.save(userRepo.create([1, 2, 3, 4, 5].map(pk => ({
        name: `Bob${pk}`,
        username: `bob${pk}`,
        email: `bob${pk}@bar.com`
      }))));
    });

    it('can be loaded into the database and finalized', async () => {
      const gameId = await persister.initialize({persister, tournamentRoundId: tr.id, ...opts}, 'foo');
      for (const [end_time, e] of ges) {
        await persister.persist([e], {gameId, dateCreated: new Date('1970 01 01'), timeRemaining: end_time})
      }
      await persister.sync();
      await sp.game.finalize(gameId);
      const players = await manager.getRepository(Player).find({where: {gameId}});
      expect(players.length).toBe(5);
      for (const p of players) {
        if (p.role === RESEARCHER) {
          expect(p.points).toBe(5);
        } else {
          expect(p.points).toBe(0);
        }
      }

    });

    afterAll(async () => {
      await qs.rollbackTransaction();
      await qs.release();
      await conn.close();
    });
  });

  it('should preserve all data of the original game play through', () => {
    const gr = new GameReplayer(ges.map(([timeRemaining, e]) =>
      toDBGameEvent(e, {gameId: 1, timeRemaining, dateCreated: new Date()})));
    const data = gr.summarize(g => ({
      phase: g.phase,
      culture: g.players.Curator.inventory.culture,
      points: g.players.Researcher.victoryPoints
    }));
    expect(data).toEqual([
      {phase: Phase.invest, culture: 0, duration: 290, points: 0},
      {phase: Phase.trade, culture: 2, duration: 295, points: 0},
      {phase: Phase.purchase, culture: 2, duration: 285, points: 5},
      {phase: Phase.discard, culture: 2, duration: 270, points: 5},
      {phase: Phase.events, culture: 2, duration: 240, points: 5},
      {phase: Phase.defeat, culture: 2, duration: 0, points: 5}
    ]);
  });
});