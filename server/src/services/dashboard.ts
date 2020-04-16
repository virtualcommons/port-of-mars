import {User} from '@port-of-mars/server/entity/User';
import {Role, ActionItem, GameMeta, Stats, RESEARCHER} from "@port-of-mars/shared/types";
import {TournamentRound} from "@port-of-mars/server/entity/TournamentRound";
import {Game, Player, TournamentRoundInvite} from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";
import {IsNull, Not} from "typeorm";

interface DashboardData {
  actionItems: Array<ActionItem>
  upcomingGames: Array<GameMeta>
  stats: Stats
}

export class DashboardService extends BaseService {
  getPassedTutorialActionItem(user: User): ActionItem {
    return {
      done: user.passedQuiz,
      description: 'Complete Tutorial',
      link: ''
    }
  }

  getCompletedIntroSurveyActionItem(round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    return {
      done: invite.hasCompletedIntroSurvey,
      description: 'Complete the introduction survey',
      link: round.introSurveyUrl ?? ''
    };
  }

  getCompletedExitSurveyActionItem(round: TournamentRound, invite: TournamentRoundInvite): ActionItem {
    return {
      done: invite.hasCompletedIntroSurvey,
      description: 'Complete the exit survey',
      link: round.exitSurveyUrl ?? ''
    }
  }

  async getCurrentGameActionItem(user: User): Promise<ActionItem | undefined> {
    const roomId = await this.sp.game.getLatestActiveGameByUserId(user.id);
    if (!roomId) {
      return;
    }
    return {
      done: false,
      description: 'Reenter the current game',
      link: `/#/game/${roomId}`
    };
  }

  async getStats(user: User, tournamentRound: TournamentRound): Promise<Stats> {
    const tournament = await this.sp.tournament.getActiveTournament();
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
      const {points, winner} = g.players.reduce((d: { winner: Role, points: number }, player: Player) => {
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

    const stats = await this.getStats(user, round);

    return {
      actionItems,
      upcomingGames: [],
      stats
    }

  }

}
