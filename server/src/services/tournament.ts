import { MoreThanOrEqual, Not, SelectQueryBuilder, Between } from "typeorm";
import {
  User,
  Player,
  Tournament,
  TournamentRound,
  TournamentRoundInvite,
  Treatment,
  Game,
} from "@port-of-mars/server/entity";
import { getServices } from "@port-of-mars/server/services";
import { BaseService } from "@port-of-mars/server/services/db";
import { LobbyChatMessage } from "@port-of-mars/server/entity/LobbyChatMessage";
import { TournamentRoundDate } from "@port-of-mars/server/entity/TournamentRoundDate";
import {
  GameType,
  LobbyChatMessageData,
  MarsEventOverride,
  TournamentRoundInviteStatus,
  TournamentRoundScheduleDate,
  TournamentStatus,
} from "@port-of-mars/shared/types";
import { TournamentRoundSignup } from "@port-of-mars/server/entity/TournamentRoundSignup";
import { ServerError } from "@port-of-mars/server/util";
import { settings, getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export class TournamentService extends BaseService {
  async getActiveTournament(): Promise<Tournament> {
    return this.em.getRepository(Tournament).findOneOrFail({
      where: { active: true, name: Not("freeplay") },
      order: {
        id: "DESC",
      },
    });
  }

  async getTournament(id?: number, includeRounds = false): Promise<Tournament> {
    if (id) {
      if (includeRounds) {
        return this.em.getRepository(Tournament).findOneOrFail({
          where: {
            id: id,
          },
          relations: ["rounds"],
        });
      }
      return this.em.getRepository(Tournament).findOneOrFail({
        where: {
          id: id,
        },
      });
    } else {
      return this.getActiveTournament();
    }
  }

  async getFreePlayTournament(): Promise<Tournament> {
    return this.em.getRepository(Tournament).findOneOrFail({
      where: { name: "freeplay" },
    });
  }

  async getTournamentByName(name: string): Promise<Tournament> {
    return this.em.getRepository(Tournament).findOneOrFail({ name });
  }

  async getCurrentTournamentRoundByType(type: GameType) {
    // get the current tournament round, if freeplay game then get the special open/freeplay tournament round
    if (type === "freeplay") {
      return await this.getFreePlayTournamentRound();
    } else {
      return await this.getCurrentTournamentRound();
    }
  }

  async getCurrentTournamentRound(tournamentId?: number): Promise<TournamentRound> {
    tournamentId = (await this.getTournament(tournamentId)).id;
    return await this.em.getRepository(TournamentRound).findOneOrFail({
      relations: ["tournament"],
      where: { tournamentId },
      order: { roundNumber: "DESC" },
    });
  }

  async getFreePlayTournamentRound(): Promise<TournamentRound> {
    const tournamentId = (await this.getFreePlayTournament()).id;
    return await this.em.getRepository(TournamentRound).findOneOrFail({
      relations: ["tournament"],
      where: { tournamentId },
      order: { roundNumber: "DESC" },
    });
  }

  async createScheduledRoundDate(
    date: Date,
    tournamentRoundId?: number
  ): Promise<TournamentRoundDate> {
    const tournamentRound = await this.getTournamentRound(tournamentRoundId);
    const repository = this.em.getRepository(TournamentRoundDate);
    const scheduledDate = repository.create({ tournamentRoundId: tournamentRound.id, date });
    return repository.save(scheduledDate);
  }

  async getUpcomingScheduledRoundDates(minutesInFuture = 60): Promise<Array<TournamentRoundDate>> {
    const now = new Date();
    const future = new Date(now.getTime() + minutesInFuture * 60 * 1000);
    return this.em.getRepository(TournamentRoundDate).find({
      where: { date: Between(now, future) },
    });
  }

  async sendRoundDateReminderEmails(minutesInFuture = 60): Promise<void> {
    /**
     * Sends reminder emails to users that have signed up for a round that is
     * scheduled to start within <minutesInFuture> from now
     */
    const roundDates = await this.getUpcomingScheduledRoundDates(minutesInFuture);
    for (const roundDate of roundDates) {
      logger.info("Sending reminder emails for round date: %s", JSON.stringify(roundDate));
      const minutesUntilLaunch = Math.round(
        (roundDate.date.getTime() - new Date().getTime()) / (60 * 1000)
      );
      const users = await this.getSignedUpUsersForDate(roundDate.id);
      for (const user of users) {
        settings.emailer.sendMail(
          {
            from: `Port of Mars <${settings.supportEmail}>`,
            to: user.email,
            subject: "[Port of Mars] Launch Reminder",
            text: `Hello ${user.username},
            
            The launch time that you signed up to be notified for is starting in
            ${minutesUntilLaunch} minutes! Head over to the tournament dashboard at
            ${settings.host}/#/tournament/dashboard and make sure you are
            ready to join the lobby once it opens.

            Good luck!
            the Port of Mars team
            `,
            html: `Hello ${user.username},
            <p>
            The launch time that you signed up to be notified for is starting in
            <b>${minutesUntilLaunch} minutes!</b>
            </p>
            <p>
            Head over to the <a href='${settings.host}/#/tournament/dashboard'>tournament dashboard</a>
            and make sure you are ready to join the lobby once it opens.
            </p>
            <p>Good luck!</p>
            <p><i>the Port of Mars team</i></p>
            `,
          },
          function (err, info) {
            if (err) {
              logger.warn(`error : $err`);
              throw new ServerError(err);
            } else {
              logger.info(`Successfully sent? %o`, info);
            }
          }
        );
      }
    }
  }

  async addSignup(user: User, tournamentRoundDateId: number, inviteId: number) {
    const invite = await this.em.getRepository(TournamentRoundInvite).findOneOrFail(inviteId);
    if (invite.userId !== user.id) {
      throw new ServerError({
        code: 403,
        message: "Invalid tournament invitation",
      });
    }
    const roundDate = await this.em
      .getRepository(TournamentRoundDate)
      .findOneOrFail(tournamentRoundDateId);

    const signup = this.em.getRepository(TournamentRoundSignup).create({
      tournamentRoundInvite: invite,
      tournamentRoundDate: roundDate,
    });
    await this.em.getRepository(TournamentRoundSignup).save(signup);
  }

  async removeSignup(user: User, tournamentRoundDateId: number, inviteId?: number) {
    const invite = await this.em.getRepository(TournamentRoundInvite).findOneOrFail(inviteId);
    if (invite.userId !== user.id) {
      throw new ServerError({
        code: 403,
        message: "Invalid tournament invitation",
      });
    }
    const roundDate = await this.em
      .getRepository(TournamentRoundDate)
      .findOneOrFail(tournamentRoundDateId);
    await this.em.getRepository(TournamentRoundSignup).delete({
      tournamentRoundInvite: invite,
      tournamentRoundDate: roundDate,
    });
  }

  async getSignedUpUsersForDate(tournamentRoundDateId: number) {
    const query = this.em
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoin("user.invites", "invite")
      .leftJoin("invite.signups", "signup")
      .where("signup.tournamentRoundDateId = :tournamentRoundDateId", { tournamentRoundDateId })
      .select("user.email")
      .addSelect("user.username")
      .distinct(true);
    const users = await query.getMany();
    return users.filter(u => u.email); // shouldn't be possible, but just in case
  }

  async getScheduledDates(options?: {
    tournamentRound?: TournamentRound;
    afterOffset?: number;
  }): Promise<Array<Date>> {
    /**
     * Returns upcoming scheduled dates for the given TournamentRound
     * includes past dates if they are within <afterOffset> of now
     * 1230 should be included for a 1200 launchtime with an afterOffset of 30
     */
    let { tournamentRound, afterOffset } = options ?? {};
    if (!tournamentRound) tournamentRound = await this.getCurrentTournamentRound();
    if (!afterOffset) afterOffset = await this.getAfterOffset();
    const offsetTime = new Date().getTime() - afterOffset;
    const schedule = await this.em.getRepository(TournamentRoundDate).find({
      select: ["date"],
      where: { tournamentRoundId: tournamentRound.id, date: MoreThanOrEqual(new Date(offsetTime)) },
      order: { date: "ASC" },
    });
    return schedule.map(s => s.date);
  }

  async getTournamentRoundSchedule(options?: {
    tournamentRound?: TournamentRound;
    user?: User;
    afterOffset?: number;
  }): Promise<Array<TournamentRoundScheduleDate>> {
    /**
     * Returns the upcoming schedule for the given TournamentRound
     * includes past dates if they are within <afterOffset> of now
     * 1230 should be included for a 1200 launchtime with an afterOffset of 30
     *
     * for a simple array of dates, use getScheduledDates
     */
    // eslint-disable-next-line prefer-const
    let { tournamentRound, afterOffset, user } = options ?? {};
    if (!tournamentRound) tournamentRound = await this.getCurrentTournamentRound();
    if (!afterOffset) afterOffset = await this.getAfterOffset();
    const offsetTime = new Date().getTime() - afterOffset;

    // get each date with associated signups
    const query = this.em
      .getRepository(TournamentRoundDate)
      .createQueryBuilder("roundDate")
      .leftJoin("roundDate.signups", "signup")
      .leftJoin("signup.tournamentRoundInvite", "invite")
      .select("roundDate.id", "tournamentRoundDateId")
      .addSelect("roundDate.date", "date")
      .addSelect("COUNT(signup.tournamentRoundDateId)", "signupCount")
      .where("roundDate.tournamentRoundId = :tournamentRoundId", {
        tournamentRoundId: tournamentRound.id,
      })
      .andWhere("roundDate.date >= :offset", { offset: new Date(offsetTime) })
      .groupBy("roundDate.id")
      .addGroupBy("roundDate.date")
      .orderBy("roundDate.date", "ASC");

    if (user) {
      // use a subquery to check if the user is signed up for each date
      query.addSelect(subQuery => {
        return subQuery
          .select("1")
          .from(TournamentRoundSignup, "subSignup")
          .innerJoin("subSignup.tournamentRoundInvite", "subInvite")
          .where("subSignup.tournamentRoundDateId = roundDate.id")
          .andWhere("subInvite.userId = :userId", { userId: user!.id });
      }, "isSignedUp");
    }

    const schedule = await query.getRawMany();
    return schedule.map(s => ({
      tournamentRoundDateId: parseInt(s.tournamentRoundDateId),
      timestamp: s.date.getTime(),
      signupCount: parseInt(s.signupCount),
      isSignedUp: user ? s.isSignedUp !== null : false,
    }));
  }

  async getEmails(tournamentRoundId?: number): Promise<Array<string>> {
    if (!tournamentRoundId) {
      const tournamentRound = await this.getCurrentTournamentRound();
      tournamentRoundId = tournamentRound.id;
    }
    const users: Array<User> = await this.em
      .getRepository(User)
      .createQueryBuilder("user")
      .innerJoin("user.invites", "invite", "invite.tournamentRoundId = :tournamentRoundId", {
        tournamentRoundId,
      })
      .getMany();
    return users.map(u => u.email ?? "no email specified - should not be possible, check database");
  }

  async createInvites(
    userIds: Array<number>,
    tournamentRoundId?: number,
    hasParticipated = false
  ): Promise<Array<TournamentRoundInvite>> {
    if (!tournamentRoundId) {
      tournamentRoundId = (await this.getCurrentTournamentRound()).id;
    }
    let invites: Array<TournamentRoundInvite> = [];
    const inviteRepository = this.em.getRepository(TournamentRoundInvite);
    if (hasParticipated) {
      invites = userIds.map(userId =>
        inviteRepository.create({
          userId,
          tournamentRoundId,
          hasParticipated,
          hasCompletedExitSurvey: true,
          hasCompletedIntroSurvey: true,
        })
      );
    } else {
      invites = userIds.map(userId => inviteRepository.create({ userId, tournamentRoundId }));
    }
    return await this.em.getRepository(TournamentRoundInvite).save(invites);
  }

  async createInvite(userId: number, tournamentRoundId: number): Promise<TournamentRoundInvite> {
    const repository = this.em.getRepository(TournamentRoundInvite);
    const invite = repository.create({ userId, tournamentRoundId });
    return await repository.save(invite);
  }

  async getTournamentRoundInvite(user: User, tournamentRound: TournamentRound) {
    const tournamentRoundId = tournamentRound.id;
    return this.em.getRepository(TournamentRoundInvite).findOne({
      where: {
        tournamentRoundId,
        userId: user.id,
      },
    });
  }

  async getOrCreateInvite(user: User, tournamentRound: TournamentRound) {
    const invite = await this.getTournamentRoundInvite(user, tournamentRound);
    if (invite) {
      return invite;
    } else {
      return await this.createInvite(user.id, tournamentRound.id);
    }
  }

  /**
   * Checks whether a user has an invite for a given or current round and has completed
   * the intro survey + has not participated yet
   */
  async canPlayInRound(user: User, tournamentRound?: TournamentRound) {
    if (!tournamentRound) {
      tournamentRound = await this.getCurrentTournamentRound();
    }
    const invite = await this.getTournamentRoundInvite(user, tournamentRound);
    if (invite) {
      return invite.hasParticipated === false && invite.hasCompletedIntroSurvey === true;
    }
    return false;
  }

  /**
   * returns the invite status for a user (survey status + url, hasParticipated)
   * if the round is open (1st round) and no invite exists, one will be created
   */
  async getTournamentRoundInviteStatus(user: User): Promise<TournamentRoundInviteStatus | null> {
    const tournamentRound = await this.getCurrentTournamentRoundByType("tournament");
    let invite = await this.getTournamentRoundInvite(user, tournamentRound);
    if (!invite) {
      // NOTE: we'll need to manually invite users for a non-open tournament
      // special case for the first round of a tournament where everyone's invited
      if (tournamentRound.roundNumber === 1) {
        invite = await this.createInvite(user.id, tournamentRound.id);
      } else {
        return null;
      }
    }
    return {
      id: invite.id,
      introSurveyUrl: getServices().survey.getIntroSurveyUrl(user, tournamentRound, invite),
      exitSurveyUrl: getServices().survey.getExitSurveyUrl(user, tournamentRound, invite),
      hasCompletedIntroSurvey: invite.hasCompletedIntroSurvey,
      hasCompletedExitSurvey: invite.hasCompletedExitSurvey,
      hasParticipated: invite.hasParticipated,
    };
  }

  async createTournament(
    data: Pick<
      Tournament,
      "name" | "active" | "minNumberOfGameRounds" | "maxNumberOfGameRounds" | "description"
    >
  ): Promise<Tournament> {
    await this.deactivateTournaments();
    const t = this.em.getRepository(Tournament).create(data);
    return await this.em.save(t);
  }

  async deactivateTournaments(): Promise<void> {
    await this.em.getRepository(Tournament).update({}, { active: false });
  }

  async getTournamentStatus(tournamentRound?: TournamentRound): Promise<TournamentStatus | null> {
    if (!tournamentRound) {
      tournamentRound = await this.getCurrentTournamentRound();
    }
    const tournament = tournamentRound.tournament;
    if (!tournament) return null;
    return {
      name: tournament.name,
      description: tournament.description ?? "",
      lobbyOpenBeforeOffset: await this.getBeforeOffset(),
      lobbyOpenAfterOffset: await this.getAfterOffset(),
      currentRound: {
        round: tournamentRound.roundNumber,
        championship: tournamentRound.championship,
        announcement: tournamentRound.announcement ?? "",
      },
    };
  }

  /**
   * Create a treatment and add it to the given or current tournament
   */
  async createTreatment(
    name: string,
    description: string,
    overrides: MarsEventOverride[],
    tournamentId?: number
  ) {
    let treatment = new Treatment();
    treatment.name = name;
    treatment.description = description;
    treatment.marsEventOverrides = overrides;
    treatment = await this.em.getRepository(Treatment).save(treatment);

    const tournament = await this.em.getRepository(Tournament).findOne({
      where: tournamentId ? { id: tournamentId } : { active: true, name: Not("freeplay") },
      relations: ["treatments"],
      order: {
        id: "DESC",
      },
    });

    if (!tournament) {
      throw new Error(`Tournament with ID ${tournamentId} not found`);
    }

    tournament.treatments = [...(tournament.treatments ?? []), treatment];
    await this.em.getRepository(Tournament).save(tournament, { reload: true });

    return treatment;
  }

  /**
   * Retrieve the set of treatments for a given tournament
   */
  async getTreatments(tournamentId: number): Promise<Treatment[]> {
    // FIXME: consider querying by Treatment.tournaments.id instead
    const tournament = await this.em
      .getRepository(Tournament)
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.treatments", "treatment")
      .where("tournament.id = :tournamentId", { tournamentId })
      .getOne();

    return tournament
      ? tournament.treatments.sort((a: Treatment, b: Treatment) => a.id - b.id)
      : [];
  }

  /**
   * Retrieve the next treatment to use for a given tournament
   * Treatments are cycled through in order
   */
  async getNextTreatment(tournamentId: number): Promise<Treatment | null> {
    const treatments = await this.getTreatments(tournamentId);
    if (treatments.length === 0) {
      return null;
    }
    // get the last game played in the tournament
    const lastGame = await this.em
      .getRepository(Game)
      .createQueryBuilder("game")
      .select("game.treatmentId")
      .innerJoin("game.tournamentRound", "tournamentRound")
      .where("tournamentRound.tournamentId = :tournamentId", { tournamentId })
      .orderBy("game.id", "DESC")
      .getOne();

    // determine the next treatment by cycling through the list
    let nextTreatment;
    if (lastGame && lastGame.treatmentId) {
      const lastTreatmentIndex = treatments.findIndex(t => t.id === lastGame.treatmentId);
      nextTreatment = treatments[(lastTreatmentIndex + 1) % treatments.length];
    } else {
      [nextTreatment] = treatments; // start with the first if no games played yet
    }
    return nextTreatment;
  }

  async createRound(
    data: Pick<
      TournamentRound,
      "exitSurveyUrl" | "introSurveyUrl" | "roundNumber" | "numberOfGameRounds" | "announcement"
    > & { tournamentId?: number }
  ): Promise<TournamentRound> {
    if (!data.tournamentId) {
      const tournament = await this.getActiveTournament();
      data.tournamentId = tournament.id;
    }

    const tr = new TournamentRound();
    Object.assign(tr, data);

    return await this.em.getRepository(TournamentRound).save(tr);
  }

  findQBAlternateCandidates(
    qb: SelectQueryBuilder<any>,
    tournamentRoundId: number
  ): SelectQueryBuilder<any> {
    return qb
      .select("player.id", "id")
      .addSelect("player.userId", "userId")
      .addSelect("player.score", "score")
      .addSelect("rank() over (partition by player.userId order by player.score desc)", "rank")
      .addSelect("game.id", "gameId")
      .from(Player, "player")
      .innerJoinAndSelect("player.game", "game")
      .where("game.tournamentRoundId = :tournamentRoundId", { tournamentRoundId })
      .orderBy("u.rank", "DESC")
      .addOrderBy("u.score", "DESC");
  }

  async findAlternativeCandidates(tournamentRoundId: number, n: number) {
    return this.em
      .createQueryBuilder()
      .from(qb => this.findQBAlternateCandidates(qb, tournamentRoundId).getQuery(), "u")
      .distinctOn(["u.userId"])
      .limit(n)
      .select("u.userId", "id");
  }

  async getTournamentRound(id?: number): Promise<TournamentRound> {
    if (id) {
      return await this.em.getRepository(TournamentRound).findOneOrFail(id);
    } else {
      return await this.getCurrentTournamentRound();
    }
  }

  /**
   * Returns true if there is a scheduled game within a specific time window of now. Currently set to open 10 mins before the
   * scheduled game, and 30 minutes after the scheduled game (i.e., 40 minute window).
   */
  async isLobbyOpen(options?: {
    gameDates?: Array<Date>;
    tournamentRound?: TournamentRound;
    beforeOffset?: number;
    afterOffset?: number;
  }): Promise<boolean> {
    let { gameDates, beforeOffset, afterOffset } = options ?? {};
    if (!gameDates)
      gameDates = await this.getScheduledDates({
        tournamentRound: options?.tournamentRound,
        afterOffset: afterOffset,
      });

    if (gameDates.length === 0) {
      return false;
    }
    if (!beforeOffset) beforeOffset = await this.getBeforeOffset();
    if (!afterOffset) afterOffset = await this.getAfterOffset();
    const now = new Date();
    for (const date of gameDates) {
      const gameTime = date.getTime();
      const openDate = new Date(gameTime - beforeOffset);
      const closeDate = new Date(gameTime + afterOffset);
      if (now > openDate && now < closeDate) {
        return true;
      }
    }
    return false;
  }

  async getBeforeOffset(): Promise<number> {
    const offset = await getServices().settings.tournamentLobbyOpenBeforeOffset();
    return offset * 60 * 1000;
  }

  async getAfterOffset(): Promise<number> {
    const offset = await getServices().settings.tournamentLobbyOpenAfterOffset();
    return offset * 60 * 1000;
  }

  /**
   * FIXME: might move this into a separate service at some point
   * @param roomId
   * @param messages
   */
  async saveLobbyChatMessages(
    roomId: string,
    roomType: GameType,
    messages: Array<LobbyChatMessageData>
  ) {
    const repository = this.em.getRepository(LobbyChatMessage);
    const lobbyChatMessages = messages.map(message =>
      repository.create({
        roomId,
        lobbyType: roomType,
        message: message.message,
        dateCreated: new Date(message.dateCreated),
        userId: message.userId,
      })
    );
    await repository.save(lobbyChatMessages);
  }
}
