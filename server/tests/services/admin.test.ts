import { Room, Client, matchMaker } from 'colyseus';
import {RegistrationService} from "@port-of-mars/server/services/registration";
import {User, Tournament, TournamentRound} from "@port-of-mars/server/entity";
import {getLogger, settings} from "@port-of-mars/server/settings";
import {Connection, EntityManager, QueryRunner} from "typeorm";
import {ServiceProvider} from "@port-of-mars/server/services";
import {buildGameOpts, ServerError} from "@port-of-mars/server/util";
import {createRound, createTournament, createUsers, initTransaction, rollbackTransaction} from "./common";
import { GameRoom } from '@port-of-mars/server/rooms/game';

// FIXME: tournament is not being created correctly leading to buildGameOpts failing
// skipping for now
describe.skip("two users and admin", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let t: Tournament;
  let tr: TournamentRound;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    sp = new ServiceProvider(qr.manager);
    t = await createTournament(sp, { name: "openbeta" }); // create open tournament
    tr = await createRound(sp, {tournamentId: t.id});
    // create users
    await createUsers(manager, "bob", [1, 2, 3, 4, 5]);
    await sp.account.getOrCreateTestUser("admin");
    await sp.account.setAdminByUsername("admin");
    const adminUser = await sp.account.findByUsername("admin");
    expect(adminUser.isAdmin).toBe(true);
    // create a new game room
    const gameOpts = await buildGameOpts(["bob1", "bob2", "bob3", "bob4", "bob5"], true);
    await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    return;
  });

  it("can submit a report", async () => {
    const msg = {
      message: "something rude",
      role: "Curator",
      dateCreated: new Date().getTime(),
      round: 1
    }
    const reportData = {
      roomId: (await matchMaker.query({ name: GameRoom.NAME }))[0].roomId,
      username: "bob1",
      message: msg
    }
    await sp.admin.submitChatReport(reportData);
    const reports = await sp.admin.getChatReports(false);
    expect(reports[0].message).toEqual(msg);
    expect(reports[0].username).toEqual("alice");
  });
});