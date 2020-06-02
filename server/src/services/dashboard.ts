import { User } from '@port-of-mars/server/entity/User';
import {Role, ActionItem, GameMeta, Stats, RESEARCHER, PlayerScores} from "@port-of-mars/shared/types";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { Game, Player, Tournament, TournamentRoundInvite } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import {IsNull, Not, SelectQueryBuilder} from "typeorm";
import { GAME_PAGE, TUTORIAL_PAGE, REGISTER_PAGE, VERIFY_PAGE } from "@port-of-mars/shared/routes";
import { settings } from "@port-of-mars/server/settings";

interface DashboardData {
  actionItems: Array<ActionItem>;
  upcomingGames: Array<GameMeta>;
  stats: Stats;
}

export class DashboardService extends BaseService {
  getInternalSurveyActionItem(user: User, round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
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
      link: { kind: 'internal', data: { name: REGISTER_PAGE }}
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
  getTakeIntroSurveyActionItem(user: User, round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    let introSurveyUrl = round.introSurveyUrl;
    if (introSurveyUrl) {
      introSurveyUrl = `${round.introSurveyUrl}?pid=${user.participantId}&tid=${invite.id}&redirectHost=${encodeURIComponent(settings.host)}`;
    }
    return {
      redoable: true,
      done: invite.hasCompletedIntroSurvey,
      description: 'Complete an introductory survey',
      link: { kind: 'external', data: introSurveyUrl ?? '' }
    };
  }

  getTakeExitSurveyActionItem(user: User, round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    let surveyUrl = round.exitSurveyUrl;
    if (surveyUrl) {
      surveyUrl = `${round.introSurveyUrl}?pid=${user.participantId}&tid=${invite.id}&redirectHost=${encodeURIComponent(settings.host)}`;
    }
    return {
      redoable: true,
      done: invite.hasCompletedExitSurvey,
      description: 'Complete an exit survey',
      link: { kind: 'external', data: surveyUrl ?? '' }
    };
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

  async getActionItems(user: User, round: TournamentRound): Promise<Array<ActionItem>> {
    const actionItems = [];
    actionItems.push(this.getRegisterActionItem(user));
    if (user.dateConsented) {
      actionItems.push(this.getVerifyActionItem(user));
      actionItems.push(this.getTakeTutorialActionItem(user));
      const invite = await this.sp.tournament.getActiveRoundInvite(user.id, round);
      if (settings.allowInternalSurveyRoutes) {
        actionItems.push(this.getInternalSurveyActionItem(user, round, invite));
      }
      actionItems.push(this.getTakeIntroSurveyActionItem(user, round, invite));
      if (user.passedQuiz && invite.hasCompletedIntroSurvey) {
        const gameActionItem = await this.getCurrentGameActionItem(user);
        if (gameActionItem) {
          actionItems.push(gameActionItem);
        }
        // if the player has completed a game for this round, offer the exit survey
        if (invite.hasParticipated) {
          actionItems.push(this.getTakeExitSurveyActionItem(user, round, invite));
        }
      }
    }

    return actionItems;
  }

  async getData(user: User): Promise<DashboardData> {
    const round = await this.sp.tournament.getCurrentTournamentRound();
    if (!round) {
      throw new Error(`no active tournament round found`);
    }
    const actionItems: Array<ActionItem> = await this.getActionItems(user, round);
    const stats = await this.getStats(user, round);
    return {
      actionItems,
      upcomingGames: [{
        time: this.sp.time.now().getTime(),
        round: round.roundNumber,
        tournamentName: round.tournament.name
      }],
      stats
    }
  }
}
