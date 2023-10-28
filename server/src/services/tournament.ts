import {
  User,
  Player,
  Tournament,
  TournamentRound,
  TournamentRoundInvite,
} from "@port-of-mars/server/entity";
import { MoreThan, SelectQueryBuilder } from "typeorm";
import { getServices } from "@port-of-mars/server/services";
import { getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import { TournamentRoundDate } from "@port-of-mars/server/entity/TournamentRoundDate";
import { TournamentRoundInviteStatus, TournamentStatus } from "@port-of-mars/shared/types";

const logger = getLogger(__filename);

export class TournamentService extends BaseService {
  async getActiveTournament(): Promise<Tournament> {
    return await this.em.getRepository(Tournament).findOneOrFail({
      where: { active: true },
      order: {
        id: "DESC",
      },
    });
  }

  async getTournament(id?: number): Promise<Tournament> {
    if (id) {
      return await this.em.getRepository(Tournament).findOneOrFail(id);
    } else {
      return await this.getActiveTournament();
    }
  }

  async getFreePlayTournament(): Promise<Tournament> {
    return await this.em.getRepository(Tournament).findOneOrFail({
      where: { name: "freeplay" },
    });
  }

  async getTournamentByName(name: string): Promise<Tournament> {
    return await this.em.getRepository(Tournament).findOneOrFail({ name });
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
    return await repository.save(scheduledDate);
  }

  async getScheduledDates(tournamentRound?: TournamentRound): Promise<Array<Date>> {
    /**
     * Returns upcoming scheduled dates for the given TournamentRound with 30 minutes of wiggle room e.g.,
     * if round is scheduled at 2021-01-03 1900, it will return that date up until 2021-01-03 1930.
     */
    if (!tournamentRound) {
      tournamentRound = await this.getCurrentTournamentRound();
    }
    // scheduled dates within 30 minutes of the scheduled tournament date should
    // still be available
    const afterOffset = await this.getAfterOffset();
    const offsetTime = new Date().getTime() - afterOffset;
    const schedule = await this.em.getRepository(TournamentRoundDate).find({
      select: ["date"],
      where: { tournamentRoundId: tournamentRound.id, date: MoreThan(new Date(offsetTime)) },
      order: { date: "ASC" },
    });
    return schedule.map(s => s.date);
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
  async getTournamentRoundInviteStatus(
    user: User,
    tournamentRound?: TournamentRound
  ): Promise<TournamentRoundInviteStatus | null> {
    if (!tournamentRound) {
      tournamentRound = await this.getCurrentTournamentRound();
    }
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
      introSurveyUrl: getServices().survey.getIntroSurveyUrl(user, tournamentRound, invite),
      hasCompletedIntroSurvey: invite.hasCompletedIntroSurvey,
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

  async getTournamentStatus(tournamentRound?: TournamentRound): Promise<TournamentStatus> {
    if (!tournamentRound) {
      tournamentRound = await this.getCurrentTournamentRound();
    }
    const tournament = tournamentRound.tournament;
    const scheduledDates = await this.getScheduledDates(tournamentRound);
    return {
      name: tournament.name,
      description: tournament.description ?? "",
      lobbyOpenBeforeOffset: await this.getBeforeOffset(),
      lobbyOpenAfterOffset: await this.getAfterOffset(),
      currentRound: {
        round: tournamentRound.roundNumber,
        schedule: scheduledDates.map((date: Date) => date.getTime()),
        championship: tournamentRound.championship,
        announcement: tournamentRound.announcement ?? "",
      },
    };
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

  async setSurveyComplete(data: { inviteId: number; surveyId: string }) {
    const invite = await this.em
      .getRepository(TournamentRoundInvite)
      .findOneOrFail(data.inviteId, { relations: ["user", "tournamentRound"] });
    const tournamentRound = invite.tournamentRound;
    const introSurveyUrl = tournamentRound.introSurveyUrl;
    const exitSurveyUrl = tournamentRound.exitSurveyUrl;
    if (introSurveyUrl && introSurveyUrl.includes(data.surveyId)) {
      invite.hasCompletedIntroSurvey = true;
      logger.debug(
        "participant %s completed intro survey %s",
        invite.user.username,
        introSurveyUrl
      );
    } else if (exitSurveyUrl && exitSurveyUrl.includes(data.surveyId)) {
      invite.hasCompletedExitSurvey = true;
      logger.debug("participant %s completed exit survey %s", invite.user.username, exitSurveyUrl);
    }
    this.em.save(invite);
  }

  /**
   * Returns true if there is a scheduled game within a specific time window of now. Currently set to open 10 mins before the
   * scheduled game, and 30 minutes after the scheduled game (i.e., 40 minute window).
   */
  async isLobbyOpen(gameDates?: Array<Date>, tournamentRound?: TournamentRound): Promise<boolean> {
    if (!gameDates) {
      gameDates = await this.getScheduledDates(tournamentRound);
    }
    if (gameDates.length === 0) {
      return false;
    }
    const beforeOffset = await this.getBeforeOffset();
    const afterOffset = await this.getAfterOffset();
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
}
