import {User} from '@port-of-mars/server/entity/User';
import {Role, ActionItem, GameMeta, Stats, RESEARCHER} from "@port-of-mars/shared/types";
import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";
import {Game, Player, Tournament, TournamentRoundInvite} from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";
import {IsNull, Not} from "typeorm";
import {GAME_PAGE, TUTORIAL_PAGE} from "@port-of-mars/shared/routes";

interface DashboardData {
  actionItems: Array<ActionItem>;
  upcomingGames: Array<GameMeta>;
  stats: Stats;
}

export class DashboardService extends BaseService {
  getPassedTutorialActionItem(user: User): ActionItem {
    return {
      done: user.passedQuiz,
      description: 'Take Tutorial',
      link: {kind: 'internal', data: TUTORIAL_PAGE}
    }
  }

  getCompletedIntroSurveyActionItem(round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    return {
      done: invite.hasCompletedIntroSurvey,
      description: 'Complete the introduction survey',
      link: {kind: 'external', data: round.introSurveyUrl ?? ''}
    };
  }

  getCompletedExitSurveyActionItem(round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    return {
      done: invite.hasCompletedIntroSurvey,
      description: 'Complete the exit survey',
      link: {kind: 'external', data: round.exitSurveyUrl ?? ''}
    }
  }

  async getCurrentGameActionItem(user: User): Promise<ActionItem | undefined> {
    const roomId = await this.sp.game.getActiveGameRoomId(user.id);
    if (!roomId) {
      return;
    }
    return {
      done: false,
      description: 'Reenter the current game',
      link: {kind: 'internal', data: GAME_PAGE}
    };
  }

  async getStats(user: User, tournamentRound: TournamentRound, tournament: Tournament): Promise<Stats> {
    const games = await this.em.getRepository(Game)
      .find({
        where: {
          players: {
            user
          },
          tournamentRound,
          dateFinalized: Not(IsNull())
        },
        relations: ['players']
      });

    const stats: Stats['games'] = games.map(g => {
      const {points, winner} = g.players.reduce((d: { winner: Role; points: number }, player: Player) => {
        if (d.points < (player.points ?? 0)) {
          d.points = player.points ?? 0;
          d.winner = player.role;
        }
        return d;
      }, {winner: RESEARCHER, points: 0});

      return {
        time: g.dateCreated.getTime(),
        round: tournamentRound.id,
        tournamentName: tournament.name,
        points,
        winner
      }
    });

    return {games: stats}

  }

  async getData(user: User): Promise<DashboardData> {
    const actionItems: Array<ActionItem> = [];
    const round = await this.sp.tournament.getCurrentTournamentRound();
    if (!round) {
      throw new Error(`no active tournament round found`);
    }

    if (!user.passedQuiz) {
      actionItems.push(this.getPassedTutorialActionItem(user));
    } else {
      const invite = await this.sp.tournament.getActiveRoundInvite(user.id, round.id);
      actionItems.push(this.getCompletedIntroSurveyActionItem(round, invite));

      const gameActionItem = await this.getCurrentGameActionItem(user);
      if (gameActionItem) {
        actionItems.push(gameActionItem);
      }
      actionItems.push(this.getCompletedExitSurveyActionItem(round, invite));
    }
    const tournament = await this.sp.tournament.getActiveTournament();

    const stats = await this.getStats(user, round, tournament);

    return {
      actionItems,
      upcomingGames: [{
        time: this.sp.time.now().getTime(),
        round: round.roundNumber,
        tournamentName: tournament.name
      }],
      stats
    }

  }

}
