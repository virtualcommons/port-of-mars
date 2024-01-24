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
import { Game, TournamentRoundInvite, Treatment, User } from "@port-of-mars/server/entity";
import { TournamentRoundDate } from "@port-of-mars/server/entity/TournamentRoundDate";
import { ServerError } from "@port-of-mars/server/util";
import { settings } from "@port-of-mars/server/settings";
import { TournamentRoundSignup } from "@port-of-mars/server/entity/TournamentRoundSignup";

describe("a tournament", () => {
  let conn: Connection;
  let qr: QueryRunner;
  let manager: EntityManager;
  let services: ServiceProvider;

  let tournament: Tournament;
  let tournamentRound: TournamentRound;
  const treatments: Treatment[] = [];
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
    const dates = await services.tournament.getScheduledDates({ tournamentRound, afterOffset });
    expect(dates).toEqual([date1, date2, date3]);
  });

  it("can add and apply treatments", async () => {
    treatments.push(
      await services.tournament.createTreatment(
        `Treatment 1`,
        `use 5 LAU cards`,
        [{ eventId: "lifeAsUsual", quantity: 5 }],
        tournament.id
      )
    );
    const treatment = await services.tournament.getNextTreatment(tournament.id);
    const overrides = treatment?.marsEventOverrides ?? null;
    expect(treatment?.marsEventOverrides).toEqual([{ eventId: "lifeAsUsual", quantity: 5 }]);
    const deck = getRandomizedMarsEventDeck(overrides);
    const lauCards = deck.filter(event => event.id === "lifeAsUsual");
    expect(lauCards.length).toBe(5);
  });

  it("can select the next treatment based on previous games played", async () => {
    for (const [num, index] of [10, 15].entries()) {
      treatments.push(
        await services.tournament.createTreatment(
          `Treatment ${index + 1}`,
          `use ${num} LAU cards`,
          [{ eventId: "lifeAsUsual", quantity: num }],
          tournament.id
        )
      );
    }
    const selectedTreatments: Treatment[] = [];
    for (let i = 0; i < 9; i++) {
      const treatment = await services.tournament.getNextTreatment(tournament.id);
      selectedTreatments.push(treatment!);
      // create a game with this treatment
      const repo = manager.getRepository(Game);
      const game = repo.create({
        roomId: "123",
        buildId: "123",
        type: "tournament",
        treatment: treatment!,
        treatmentId: treatment!.id,
        tournamentRound: tournamentRound,
        tournamentRoundId: tournamentRound.id,
      });
      await repo.save(game);
    }
    // expect 3 of each treatment in selected treatments
    const counts = selectedTreatments.reduce((acc, treatment) => {
      acc[treatment.id] = (acc[treatment.id] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    expect(Object.values(counts)).toEqual([3, 3, 3]);
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

  it("opens the lobby at the correct time", async () => {
    const now = new Date().getTime();
    // 11 min in the future (should remain closed)
    const furtherFuture = new Date(now + (beforeOffset + 1000 * 60));
    await services.tournament.createScheduledRoundDate(furtherFuture, tournamentRound.id);
    expect(await services.tournament.isLobbyOpen({ beforeOffset, afterOffset })).toBe(false);
    // 9 min in the future (should be open)
    const nearFuture = new Date(now + (beforeOffset - 1000 * 60));
    await services.tournament.createScheduledRoundDate(nearFuture, tournamentRound.id);
    expect(await services.tournament.isLobbyOpen({ beforeOffset, afterOffset })).toBe(true);
    // reset dates
    await manager
      .getRepository(TournamentRoundDate)
      .delete({ tournamentRoundId: tournamentRound.id });
  });

  it("closes the lobby at the correct time", async () => {
    const now = new Date().getTime();
    // 31 min in the past (should remain closed)
    const furtherPast = new Date(now - (afterOffset + 1000 * 60));
    await services.tournament.createScheduledRoundDate(furtherPast, tournamentRound.id);
    expect(await services.tournament.isLobbyOpen({ beforeOffset, afterOffset })).toBe(false);
    // 29 min in the past (should be open)
    const nearPast = new Date(now - (beforeOffset - 1000 * 60));
    await services.tournament.createScheduledRoundDate(nearPast, tournamentRound.id);
    expect(await services.tournament.isLobbyOpen({ beforeOffset, afterOffset })).toBe(true);
    // reset dates
    await manager
      .getRepository(TournamentRoundDate)
      .delete({ tournamentRoundId: tournamentRound.id });
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

    it("can sign up for tournament round dates", async () => {
      await services.tournament.createScheduledRoundDate(
        new Date(new Date().getTime() + 60 * 1000 * 60),
        tournamentRound.id
      );
      await services.tournament.createScheduledRoundDate(
        new Date(new Date().getTime() + 120 * 1000 * 60),
        tournamentRound.id
      );
      let schedule = await services.tournament.getTournamentRoundSchedule({
        user: player1,
        afterOffset,
      });
      const date1Id = schedule[0].tournamentRoundDateId;
      const date2Id = schedule[1].tournamentRoundDateId;
      const invite1Id = (await services.tournament.getOrCreateInvite(player1, tournamentRound)).id;
      const invite2Id = (await services.tournament.getOrCreateInvite(player2, tournamentRound)).id;
      // player 1 signs up for date 1
      await services.tournament.addSignup(player1, date1Id, invite1Id);
      schedule = await services.tournament.getTournamentRoundSchedule({
        user: player1,
        afterOffset,
      });
      expect(schedule[0].isSignedUp).toBe(true);
      expect(schedule[0].signupCount).toBe(1);
      // two players sign up for the same date
      await services.tournament.addSignup(player2, date1Id, invite2Id);
      schedule = await services.tournament.getTournamentRoundSchedule({
        user: player2,
        afterOffset,
      });
      expect(schedule[0].isSignedUp).toBe(true);
      expect(schedule[0].signupCount).toBe(2);
      // player 2 signs up for date 2
      await services.tournament.addSignup(player2, date2Id, invite2Id);
      schedule = await services.tournament.getTournamentRoundSchedule({
        user: player2,
        afterOffset,
      });
      expect(schedule[1].isSignedUp).toBe(true);
      expect(schedule[1].signupCount).toBe(1);
      // both players cancel signups for date 1
      await services.tournament.removeSignup(player1, date1Id, invite1Id);
      await services.tournament.removeSignup(player2, date1Id, invite2Id);
      schedule = await services.tournament.getTournamentRoundSchedule({
        user: player2,
        afterOffset,
      });
      expect(schedule[0].isSignedUp).toBe(false);
      expect(schedule[0].signupCount).toBe(0);
      await services.tournament.removeSignup(player2, date2Id, invite2Id);
    });

    it("handles invalid signup requests", async () => {
      await services.tournament.createScheduledRoundDate(
        new Date(new Date().getTime() + 60 * 1000 * 60),
        tournamentRound.id
      );
      // player cannot sign up for the same date twice
      let schedule = await services.tournament.getTournamentRoundSchedule({
        user: player1,
        afterOffset,
      });
      const date1Id = schedule[0].tournamentRoundDateId;
      const invite1Id = (await services.tournament.getOrCreateInvite(player1, tournamentRound)).id;
      const invite2Id = (await services.tournament.getOrCreateInvite(player2, tournamentRound)).id;
      await services.tournament.addSignup(player1, date1Id, invite1Id);
      await services.tournament.addSignup(player1, date1Id, invite1Id);
      schedule = await services.tournament.getTournamentRoundSchedule({
        user: player1,
        afterOffset,
      });
      expect(schedule[0].signupCount).toBe(1);
      // user cannot sign up a different player for a date
      await expect(services.tournament.addSignup(player1, date1Id, invite2Id)).rejects.toThrowError(
        ServerError
      );
    });

    it("gets sent an email reminder", async () => {
      await services.tournament.createScheduledRoundDate(
        new Date(new Date().getTime() + 5 * 1000 * 60),
        tournamentRound.id
      );
      const schedule = await services.tournament.getTournamentRoundSchedule({
        user: player1,
        afterOffset,
      });
      const nearestDateId = schedule[0].tournamentRoundDateId;
      const invite1Id = (await services.tournament.getOrCreateInvite(player1, tournamentRound)).id;
      await services.tournament.addSignup(player1, nearestDateId, invite1Id);
      await services.tournament.sendRoundDateReminderEmails();
      expect(settings.emailer.lastEmail?.from).toBe("Port of Mars <portmars@asu.edu>");
      expect(settings.emailer.lastEmail?.to).toBe(player1.email);
    });
  });

  afterAll(async () => rollbackTransaction(conn, qr));
});
