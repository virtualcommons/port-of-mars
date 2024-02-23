import { Tournament, TournamentRound, Game } from "@port-of-mars/server/entity";
import { EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import {
  createRound,
  createTournament,
  createUsers,
  initTransaction,
  rollbackTransaction,
} from "../common";
import { BAN, ModerationActionType, MUTE } from "@port-of-mars/shared/types";

describe("users in a game", () => {
  let qr: QueryRunner;
  let manager: EntityManager;
  let sp: ServiceProvider;
  let t: Tournament;
  let tr: TournamentRound;

  beforeAll(async () => {
    [qr, manager] = await initTransaction();
    sp = new ServiceProvider(manager);
    t = await createTournament(sp, { name: "freeplay" });
    tr = await createRound(sp, { tournamentId: t.id });
    // create users
    await createUsers(manager, "steve", [1, 2, 3, 4, 5, 6]);
    await sp.account.getOrCreateTestUser("admin");
    // create a new game
    const g = new Game();
    g.buildId = "test";
    g.tournamentRoundId = tr.id;
    g.roomId = "foobar";
    await manager.save(g);
  });

  it("one can submit a report", async () => {
    const msg = {
      message: "something rude",
      role: "Curator",
      dateCreated: jest.getRealSystemTime(),
      round: 1,
    };
    const reportData = {
      roomId: "foobar",
      username: "steve1",
      message: msg,
    };
    await sp.admin.submitChatReport(reportData);
    const reports = await sp.admin.getChatReports(false);
    expect(reports[0].message).toEqual(msg);
    expect(reports[0].username).toEqual("steve1");
  });

  describe("an admin user", () => {
    beforeAll(async () => {
      // set up admin user and sample chat reports/actions
      await sp.account.setAdminByUsername("admin");
      const adminUser = await sp.account.findByUsername("admin");
      expect(adminUser.isAdmin).toBe(true);
      await createChatReports(sp, ["steve2", "steve3", "steve4", "steve5", "steve6"]);
      await createModerationActions(sp, ["steve1", "steve2"], [MUTE, BAN]);
      // now have:
      //       ACTIONS                 REPORTS
      //  ----------------------    --------------
      //  id | username | action    id | username
      //  ----------------------    --------------
      //  1  | steve1   | mute      1  | steve1
      //  2  | steve2   | ban       2  | steve2
      //                            3  | steve3
      //                            4  | steve4
      //                            5  | steve5
      //                            6  | steve6
    });

    it("can get a list of chat reports", async () => {
      const reports = await sp.admin.getChatReports(false);
      expect(reports.length).toBe(6);
    });

    it("can get a list of moderation actions", async () => {
      const incidents = await sp.admin.getModerationActions();
      expect(incidents.length).toBe(2);
    });

    it("can mute a user based on a report", async () => {
      const username = "steve3";
      const reports = await sp.admin.getChatReports(false);
      const report = reports.find(r => r.username === username);
      let user = await sp.account.findByUsername(username);
      expect(user.isMuted).toBe(false);
      expect(user.muteStrikes).toBe(0);
      await sp.admin.takeModerationAction({
        reportId: report!.id,
        username: report!.username,
        adminUsername: "admin",
        action: MUTE,
        daysMuted: 3,
      });
      user = await sp.account.findByUsername(username);
      expect(user.isMuted).toBe(true);
      expect(user.muteStrikes).toBe(1);
    });

    it("can ban a user based on a report", async () => {
      const username = "steve4";
      const reports = await sp.admin.getChatReports(false);
      const report = reports.find(r => r.username === username);
      let user = await sp.account.findByUsername(username);
      expect(user.isBanned).toBe(false);
      await sp.admin.takeModerationAction({
        reportId: report!.id,
        username: report!.username,
        adminUsername: "admin",
        action: BAN,
      });
      user = await sp.account.findByUsername(username);
      expect(user.isBanned).toBe(true);
    });

    it("can undo an actions", async () => {
      const username = "steve5";
      const reports = await sp.admin.getChatReports(false);
      const report = reports.find(r => r.username === username);
      await sp.admin.takeModerationAction({
        reportId: report!.id,
        username: report!.username,
        adminUsername: "admin",
        action: MUTE,
        daysMuted: 3,
      });
      let user = await sp.account.findByUsername(username);
      expect(user.isMuted).toBe(true);
      expect(user.muteStrikes).toBe(1);
      const actions = await sp.admin.getModerationActions();
      const action = actions.find(r => r.username === username);
      await sp.admin.undoModerationAction({ moderationActionId: action!.id, username });
      user = await sp.account.findByUsername(username);
      expect(user.isMuted).toBe(false);
      expect(user.muteStrikes).toBe(0);
    });

    it("resolves expired mutes", async () => {
      const username = "steve6";
      const reports = await sp.admin.getChatReports(false);
      const report = reports.find(r => r.username === username);
      await sp.admin.takeModerationAction({
        reportId: report!.id,
        username: report!.username,
        adminUsername: "admin",
        action: MUTE,
        daysMuted: 0,
      });
      let user = await sp.account.findByUsername(username);
      expect(user.isMuted).toBe(true);
      expect(user.muteStrikes).toBe(1);
      await sp.admin.unapplyExpiredMutes();
      user = await sp.account.findByUsername(username);
      expect(user.isMuted).toBe(false);
      expect(user.muteStrikes).toBe(1);
    });
  });
  afterAll(async () => await rollbackTransaction(qr));
});

const createChatReports = async (sp: ServiceProvider, usernames: Array<string>) => {
  for (const username of usernames) {
    const msg = {
      message: `I am ${username} and I am rude`,
      role: "Curator",
      dateCreated: jest.getRealSystemTime(),
      round: 1,
    };
    const data = {
      roomId: "foobar",
      username: username,
      message: msg,
    };
    await sp.admin.submitChatReport(data);
  }
};

const createModerationActions = async (
  sp: ServiceProvider,
  usernames: Array<string>,
  actions: Array<ModerationActionType>
) => {
  const reports = await sp.admin.getChatReports(false);
  for (const [i, u] of usernames.entries()) {
    const data = {
      reportId: reports[i].id,
      username: u,
      adminUsername: "admin",
      action: actions[i],
      daysMuted: actions[i] === MUTE ? 3 : undefined,
    };
    await sp.admin.takeModerationAction(data);
  }
};
