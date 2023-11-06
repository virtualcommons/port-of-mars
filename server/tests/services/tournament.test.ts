import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Tournament } from "@port-of-mars/server/entity/Tournament";
import { Connection, EntityManager, QueryRunner } from "typeorm";
import { ServiceProvider } from "@port-of-mars/server/services";
import {
  createRound,
  createTournament,
  createUsers,
  initTransaction,
  rollbackTransaction,
} from "../common";
import { getRandomizedMarsEventDeck } from "@port-of-mars/server/rooms/game/state/marsevents/common";
import { TournamentRoundInvite, User } from "@port-of-mars/server/entity";

describe("a tournament", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let services: ServiceProvider;

  let tournament: Tournament;
  let tournamentRound: TournamentRound;
  const surveyId = "ABC123";
  const surveyUrl = `https://example.com/${surveyId}`;

  // currently need to manually define these otherwise redis settings get used and
  // cause the tests to hang, need to figure out a better solution here
  const beforeOffset = 10 * 60 * 1000;
  const afterOffset = 30 * 60 * 1000;

  beforeAll(async () => {
    [conn, qr, manager] = await initTransaction();
    services = new ServiceProvider(qr.manager);
    // create special freeplay tournament
    const freeplayTournament = await createTournament(services, { name: "freeplay" });
    await createRound(services, { tournamentId: freeplayTournament.id });
    tournament = await createTournament(services);
    tournamentRound = await createRound(services, {
      tournamentId: tournament.id,
      introSurveyUrl: surveyUrl,
    });
  });

  it("can be created", async () => {
    expect(tournamentRound.tournamentId).toEqual(tournament.id);
  });

  it("can set dates", async () => {
    const date1 = new Date("2525-01-01T00:00:00");
    const date2 = new Date("2525-01-01T03:00:00");
    const date3 = new Date("2525-01-01T06:00:00");
    await services.tournament.createScheduledRoundDate(date1, tournamentRound.id);
    await services.tournament.createScheduledRoundDate(date2, tournamentRound.id);
    await services.tournament.createScheduledRoundDate(date3, tournamentRound.id);
    const dates = await services.tournament.getScheduledDates({ tournamentRound, beforeOffset });
    expect(dates).toEqual([date1, date2, date3]);
  });

  it("can add and apply treatments", async () => {
    await services.tournament.createTreatment(
      "less LAU",
      "only use 5 life as usual event cards",
      [{ eventId: "lifeAsUsual", quantity: 5 }],
      tournament.id
    );
    const treatment = await services.tournament.getNextTreatment(tournament.id);
    const overrides = treatment?.marsEventOverrides ?? null;
    expect(treatment?.marsEventOverrides).toEqual([{ eventId: "lifeAsUsual", quantity: 5 }]);
    const deck = getRandomizedMarsEventDeck(overrides);
    const lauCards = deck.filter(event => event.id === "lifeAsUsual");
    expect(lauCards.length).toBe(5);
  });

  it("can differentiate between freeplay and tournament", async () => {
    const fpTournamentRound = await services.tournament.getCurrentTournamentRoundByType("freeplay");
    const mmTournamentRound = await services.tournament.getCurrentTournamentRoundByType(
      "tournament"
    );
    expect(fpTournamentRound.id).not.toBe(tournamentRound.id);
    expect(mmTournamentRound.id).toBe(tournamentRound.id);
    expect(fpTournamentRound.tournamentId).not.toBe(tournament.id);
    expect(mmTournamentRound.tournamentId).toBe(tournament.id);
  });

  it("lobby opens and closes depending on dates", async () => {
    expect(await services.tournament.isLobbyOpen({ beforeOffset, afterOffset })).toBe(false);
    const now = new Date();
    await services.tournament.createScheduledRoundDate(now, tournamentRound.id);
    expect(await services.tournament.isLobbyOpen({ beforeOffset, afterOffset })).toBe(true);
  });

  describe("players", () => {
    let player1: User;
    let player2: User;

    beforeAll(async () => {
      [player1, player2] = await createUsers(manager, "mary", [1, 2]);
    });

    it("will be automatically given an invite for round 1", async () => {
      expect((await services.tournament.getCurrentTournamentRound()).roundNumber).toBe(1);
      const inviteStatus = await services.tournament.getTournamentRoundInviteStatus(player1);
      expect(inviteStatus).not.toBeNull();
      expect(inviteStatus?.hasParticipated).toBe(false);
      expect(inviteStatus?.hasCompletedIntroSurvey).toBe(false);
    });

    it("can set survey completion", async () => {
      const invite = await services.tournament.getTournamentRoundInvite(player1, tournamentRound);
      await services.survey.setSurveyComplete({ inviteId: invite!.id, surveyId });
      const inviteStatus = await services.tournament.getTournamentRoundInviteStatus(player1);
      expect(inviteStatus?.hasCompletedIntroSurvey).toBe(true);
    });

    it("cannot play without an invite", async () => {
      expect(await services.tournament.canPlayInRound(player2, tournamentRound)).toBe(false);
    });

    it("cannot play if intro survey is incomplete", async () => {
      const invite = await services.tournament.createInvite(player2.id, tournamentRound.id);
      expect(await services.tournament.canPlayInRound(player2, tournamentRound)).toBe(false);
    });

    it("can play if all onboarding items are complete", async () => {
      // player 1 has completed the intro survey
      expect(await services.tournament.canPlayInRound(player1, tournamentRound)).toBe(true);
    });

    it("cannot play if they have participated already", async () => {
      const invite = (await services.tournament.getTournamentRoundInvite(
        player1,
        tournamentRound
      ))!;
      invite.hasParticipated = true;
      await manager.getRepository(TournamentRoundInvite).save(invite);
      expect(await services.tournament.canPlayInRound(player1, tournamentRound)).toBe(false);
    });
  });

  afterAll(async () => rollbackTransaction(conn, qr));
});
