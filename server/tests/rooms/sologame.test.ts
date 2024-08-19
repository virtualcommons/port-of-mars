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
import { EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import { createUsers, initTransaction, rollbackTransaction } from "../common";
import {
  CreateDeckCmd,
  InitGameCmd,
  SetPlayerCmd,
  SetTreatmentParamsCmd,
} from "@port-of-mars/server/rooms/sologame/commands";
import { SoloGameRoom } from "@port-of-mars/server/rooms/sologame";
import { Dispatcher } from "@colyseus/command";
import { SoloGameService } from "@port-of-mars/server/services/sologame";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

/**
 * Contains tests for the solo game server logic
 *
 * checking whether the game logic functions as expected and that things
 * are saved/retrieved correctly from the db
 */

describe("a solo game", () => {
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let user1: User;
  let user2: User;
  let user3: User;

  beforeAll(async () => {
    [qr, manager] = await initTransaction();
    sp = new ServiceProvider(manager);
    // create users paul1 paul2 paul3
    [user1, user2, user3] = await createUsers(manager, "paul", [1, 2, 3]);
  });

  afterAll(async () => await rollbackTransaction(qr));

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
      // manually dispose of the room, otherwise it lingers while it waits for the
      // auto-dispose timeout
      room._events.emit("dispose");
    });

    it("sets a player", async () => {
      await dispatcher.dispatch(new SetPlayerCmd().setPayload({ user: user1 }));
      expect(state.player.username).toBe(user1.username);
    });

    it("draws a deck from the db", async () => {
      await dispatcher.dispatch(new CreateDeckCmd());
      expect(state.eventCardDeck.length).toBeGreaterThan(0);
    });

    it("selects treatment params from the db", async () => {
      // TODO: we also need to test this harder to make sure that the treatments are randomized
      // and not repeated for the player's first 12 games, but this describe block is for running
      // through a normal game, so we'll do that elsewhere
      await dispatcher.dispatch(new SetTreatmentParamsCmd().setPayload({ user: user1 }));
      expect(state.treatmentParams.isEventDeckKnown).toBeDefined();
      expect(state.treatmentParams.isNumberOfRoundsKnown).toBeDefined();
      expect(state.treatmentParams.thresholdInformation).toBeDefined();
      expect(state.treatmentParams.isLowResSystemHealth).toBeDefined();
    });

    // continue with game logic/command tests, intent is to run through a game
  });

  // any additional tests (services, etc), additionally can create new describe blocks
});
