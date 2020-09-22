import { User } from '@port-of-mars/server/entity/User';
import {ActionItem, Stats, PlayerScores} from "@port-of-mars/shared/types";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Game, Player, TournamentRoundInvite } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import {IsNull, Not, SelectQueryBuilder} from "typeorm";
import { GAME_PAGE, TUTORIAL_PAGE, CONSENT_PAGE, VERIFY_PAGE } from "@port-of-mars/shared/routes";
import { PlayerTaskCompletion, DashboardData } from "@port-of-mars/shared/types";
import { settings } from "@port-of-mars/server/settings";
import _ from "lodash";


export class DashboardService extends BaseService {
  getInternalCompleteSurveyActionItem(user: User, round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    // https://asu.co1.qualtrics.com/jfe/form/SV_0c8tCMZkAUh4V8x
    // FIXME: generate the correct survey completion URL for the given user and tournament round invite
    let surveyUrl = round.introSurveyUrl;
    if (surveyUrl) {
      const surveyId = surveyUrl.split('/').pop();
      surveyUrl = `/survey/complete?pid=${user.participantId}&tid=${invite.id}&surveyId=${surveyId}`;
    }
    return {
      redoable: true,
      done: invite.hasCompletedIntroSurvey,
      description: 'DEVMODE: Mark intro survey as completed',
      link: { kind: 'external', data: surveyUrl ?? ''}
    };
  }
  getRegisterActionItem(user: User): ActionItem {
    return {
      redoable: true,
      done: !!user.dateConsented,
      description: 'View consent form and register email',
      link: { kind: 'internal', data: { name: CONSENT_PAGE }}
    };
  }
  getVerifyActionItem(user: User): ActionItem {
    return {
      redoable: false,
      done: user.isVerified,
      description: 'Verify your email',
      link: { kind: 'internal', data: { name: VERIFY_PAGE, params: { token: user.registrationToken }}}
    };
  }
  getTakeTutorialActionItem(user: User): ActionItem {
    return {
      redoable: true,
      done: user.passedQuiz,
      description: 'Take tutorial',
      link: { kind: 'internal', data: { name: TUTORIAL_PAGE }}
    };
  }


  /**
   * generate a parameterized survey URL with pid=participantId and tid=tournamentRoundInvite.id
   * @param round 
   * @param invite 
   */
  getIntroSurveyUrl(user: User, round: TournamentRound, invite: TournamentRoundInvite | undefined): string {
    let introSurveyUrl = round.introSurveyUrl;
    if (invite && introSurveyUrl) {
      introSurveyUrl = `${round.introSurveyUrl}?pid=${user.participantId}&tid=${invite.id}&redirectHost=${encodeURIComponent(settings.host)}`;
    }
    return introSurveyUrl ?? '';
  }

  getExitSurveyUrl(user: User, round: TournamentRound, invite: TournamentRoundInvite | undefined): string {
    let surveyUrl = round.exitSurveyUrl;
    if (invite && surveyUrl) {
      surveyUrl = `${round.introSurveyUrl}?pid=${user.participantId}&tid=${invite.id}&redirectHost=${encodeURIComponent(settings.host)}`;
    }
    return surveyUrl ?? '';
  }

  async getCurrentGameActionItem(user: User): Promise<ActionItem | undefined> {
    const roomId = await this.sp.game.getActiveGameRoomId(user.id);
    if (!roomId) {
      return;
    }
    return {
      redoable: true,
      done: false,
      description: 'Rejoin your current game',
      link: { kind: 'internal', data: { name: GAME_PAGE }}
    };
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
      const playerScores = g.players.reduce((d: PlayerScores, player: Player) => {
        d.push({role: player.role, points: player.points ?? 0, winner: player.points === maxScore})
        return d;
      }, []);
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
    return _.isUndefined(user.dateConsented)
  }

  mustTakeTutorial(user: User): boolean {
    return !user.passedQuiz
  }

  mustTakeIntroSurvey(invite: TournamentRoundInvite | undefined): boolean {
    return _.isUndefined(invite) || !invite.hasCompletedIntroSurvey
  }

  canPlayGame(invite: TournamentRoundInvite | undefined): boolean {
    return _.isUndefined(invite) || !invite.hasParticipated
  }

  shouldTakeExitSurvey(invite: TournamentRoundInvite | undefined): boolean {
    return _.isUndefined(invite) || !invite.hasCompletedExitSurvey
  }

  async getPlayerTaskCompletion(user: User, invite: TournamentRoundInvite | undefined): Promise<PlayerTaskCompletion> {
    return {
      mustVerifyEmail: this.mustVerifyEmail(user),
      mustConsent: this.mustProvideConsent(user),
      mustTakeTutorial: this.mustTakeTutorial(user),
      mustTakeIntroSurvey: this.mustTakeIntroSurvey(invite),
      canPlayGame: this.canPlayGame(invite),
      shouldTakeExitSurvey: this.shouldTakeExitSurvey(invite),
    }
  }

  async getData(user: User): Promise<DashboardData> {
    const round = await this.sp.tournament.getCurrentTournamentRound();
    if (!round) {
      throw new Error(`no active tournament round found`);
    }
    const invite = await this.sp.tournament.getActiveRoundInviteIfExists(user.id, round);
    const playerTaskCompletion: PlayerTaskCompletion = await this.getPlayerTaskCompletion(user, invite);
    const stats = await this.getStats(user, round);
    // FIXME: this canned game schedule should be retrieved from the DB in the future
    // first game is September 30th, 1500
    // Arizona time is UTC-7 so 1500 - 7 = 8
    const firstGameDate = new Date('Sep 30 2020 15:00:00 GMT-0700');
    const secondGameDate = new Date('Sep 30 2020 19:00:00 GMT-0700');
    const upcomingGames = [
      {time: firstGameDate.getTime(), round: round.roundNumber, tournamentName: round.tournament.name},
      {time: secondGameDate.getTime(), round: round.roundNumber, tournamentName: round.tournament.name},
    ];
    return {
      playerTaskCompletion,
      introSurveyUrl: this.getIntroSurveyUrl(user, round, invite),
      exitSurveyUrl: this.getExitSurveyUrl(user, round, invite),
      upcomingGames,
      stats
    }
  }
}
