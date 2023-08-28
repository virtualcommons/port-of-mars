import {
  SoloGame,
  SoloGameRound,
  SoloGameTreatment,
  SoloMarsEventCard,
  SoloMarsEventDeck,
  SoloMarsEventDeckCard,
  SoloPlayer,
  SoloPlayerDecision,
  User,
} from "@port-of-mars/server/entity";
import { SoloGameState } from "@port-of-mars/server/rooms/sologame/state";
import { Connection, EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { createUsers, initTransaction, rollbackTransaction } from "../../services/common";
import {
  CreateDeckCmd,
  InitGameCmd,
  SetPlayerCmd,
} from "@port-of-mars/server/rooms/sologame/commands";
import { SoloGameRoom } from "@port-of-mars/server/rooms/sologame";
import { Dispatcher } from "@colyseus/command";
import { SoloGameService } from "@port-of-mars/server/services/sologame";

/**
 * Contains tests for the solo game server logic
 *
 * checking whether the game logic functions as expected and that things
 * are saved/retrieved correctly from the db
 */

describe("a solo game", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let user1: User;
  let user2: User;
  let user3: User;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    sp = new ServiceProvider(qr.manager);
    // create users paul1 paul2 paul3
    [user1, user2, user3] = await createUsers(manager, "paul", [1, 2, 3]);
  });

  afterAll(async () => await rollbackTransaction(conn, qr));

  describe("a solo game room", () => {
    let room: SoloGameRoom;
    let state: SoloGameState;
    let game: SoloGame;
    let dispatcher: Dispatcher<SoloGameRoom>;

    beforeAll(() => {
      room = new SoloGameRoom();
      state = new SoloGameState();
      room.setState(state);
      dispatcher = new Dispatcher(room);
    });

    afterAll(() => {
      room.eventTimeout?.clear();
      room.clock.clear();
    });

    it("sets a player", async () => {
      await dispatcher.dispatch(new SetPlayerCmd().setPayload({ user: user1 }));
      expect(state.player.username).toBe(user1.username);
    });

    it("draws a deck from the db", async () => {
      await dispatcher.dispatch(new CreateDeckCmd());
      expect(state.eventCardDeck.length).toBeGreaterThan(0);
    });

    // continue with game logic/command tests, intent is to run through a game
  });

  // any additional tests (services, etc), additionally can create new describe blocks
});
