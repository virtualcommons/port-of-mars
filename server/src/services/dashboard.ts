import { User } from '@port-of-mars/server/entity/User';
import {Stats} from "@port-of-mars/shared/types";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Game, TournamentRoundInvite } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import {IsNull, Not, SelectQueryBuilder} from "typeorm";
import { PlayerTaskCompletion, DashboardData } from "@port-of-mars/shared/types";
import { getLogger, settings } from "@port-of-mars/server/settings";
import _ from "lodash";

const logger = getLogger(__filename);


export class DashboardService extends BaseService {

  /**
   * generate a parameterized survey URL with pid=participantId and tid=tournamentRoundInvite.id
   * @param round 
   * @param invite 
   */
  getIntroSurveyUrl(user: User, round: TournamentRound, invite: TournamentRoundInvite | undefined): string {
    return this.buildSurveyUrl(round.introSurveyUrl, user, invite);
  }

  getExitSurveyUrl(user: User, round: TournamentRound, invite: TournamentRoundInvite | undefined): string {
    return this.buildSurveyUrl(round.exitSurveyUrl, user, invite);
  }

  buildSurveyUrl(surveyUrl: string | undefined, user: User, invite: TournamentRoundInvite | undefined): string {
    if (invite && surveyUrl) {
      surveyUrl = `${surveyUrl}?pid=${user.participantId}&tid=${invite.id}&redirectHost=${encodeURIComponent(settings.host)}`;
      logger.debug("survey url: %s", surveyUrl);
    }
    return surveyUrl ?? '';
  }

  async getStats(user: User, tournamentRound: TournamentRound): Promise<Stats> {
    const games = await this.em.getRepository(Game)
      .find({
        join: { alias: 'games', innerJoin: { players: 'games.players' }},
        where: (qb: SelectQueryBuilder<Game>) => {
          qb.where({tournamentRound, dateFinalized: Not(IsNull())})
            .andWhere('players.user.id = :userId', {userId: user.id})
        },
        relations: ['players']
      });

    const stats: Stats['games'] = games.map(g => {
      const maxScore = g.players.reduce((ms, player) => {
        if (player.points ?? 0 > ms) {
          return player.points ?? 0;
        } else {
          return ms;
        }
      }, 0);
      const playerScores = g.players.map(player => 
        ({ role: player.role,
           points: player.points ?? 0,
           winner: (player.points === maxScore),
           isSelf: player.userId === user.id,
        })
      );
      playerScores.sort((a, b) => b.points - a.points);

      return {
        time: g.dateCreated.getTime(),
        round: tournamentRound.id,
        tournamentName: tournamentRound.tournament.name,
        playerScores,
        victory: g.status === 'victory'
      }
    });

    return { games: stats }
  }

  mustVerifyEmail(user: User): boolean {
    return !user.isVerified;
  }

  mustProvideConsent(user: User): boolean {
    return _.isNil(user.dateConsented)
  }

  mustTakeTutorial(user: User): boolean {
    return !user.passedQuiz
  }

  mustTakeIntroSurvey(invite: TournamentRoundInvite | undefined): boolean {
    if (invite) {
      return ! invite.hasCompletedIntroSurvey;
    }
    return false;
  }

  /**
   * Returns true if the player has participated or they do not have an invite (to prevent them from participating again).
   * @param invite Returns
   */
  canPlayGame(invite: TournamentRoundInvite | undefined): boolean {
    if (invite) {
      return ! invite.hasParticipated;
    }
    return false;
  }

  shouldTakeExitSurvey(invite: TournamentRoundInvite | undefined): boolean {
    if (invite) {
      return invite.hasParticipated && ! invite.hasCompletedExitSurvey
    }
    return false;
  }

  async getPlayerTaskCompletion(user: User, invite: TournamentRoundInvite | undefined): Promise<PlayerTaskCompletion> {
    // FIXME: at some point we should make these predicates all semantically consistent
    return {
      mustVerifyEmail: this.mustVerifyEmail(user),
      mustConsent: this.mustProvideConsent(user),
      mustTakeTutorial: this.mustTakeTutorial(user),
      mustTakeIntroSurvey: this.mustTakeIntroSurvey(invite),
      canPlayGame: this.canPlayGame(invite),
      shouldTakeExitSurvey: this.shouldTakeExitSurvey(invite),
      hasInvite: !_.isUndefined(invite),
    }
  }

  async getData(user: User): Promise<DashboardData> {
    const round = await this.sp.tournament.getCurrentTournamentRound();
    if (!round) {
      throw new Error(`no active tournament round found`);
    }
    const stats = await this.getStats(user, round);
    const invite = await this.sp.tournament.getActiveRoundInvite(user.id, round);
    const playerTaskCompletion: PlayerTaskCompletion = await this.getPlayerTaskCompletion(user, invite);
    const gameDates = await this.sp.tournament.getScheduledDates(round);
    const upcomingGames = gameDates.map( date => {
      return {time: date.getTime(), round: round.roundNumber, tournamentName: round.tournament.name};
    });
    return {
      playerTaskCompletion,
      introSurveyUrl: this.getIntroSurveyUrl(user, round, invite),
      exitSurveyUrl: this.getExitSurveyUrl(user, round, invite),
      upcomingGames,
      isSignUpEnabled: await this.sp.settings.isSignUpEnabled(),
      currentRoundNumber: round.roundNumber,
      isLobbyOpen: await this.sp.tournament.isLobbyOpen(gameDates),
      stats
    }
  }
}