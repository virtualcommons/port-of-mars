import { Game, User, Player, Tournament, TournamentRound, TournamentRoundInvite } from '@port-of-mars/server/entity';
import { Equal, SelectQueryBuilder } from 'typeorm';
import * as _ from 'lodash';
import { getLogger } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

const logger = getLogger(__filename);

export class TournamentService extends BaseService {
  async getActiveTournament(): Promise<Tournament> {
    return await this.em
      .getRepository(Tournament)
      .findOneOrFail({
        active: true
      });
  }

  async getTournamentByName(name: string): Promise<Tournament> {
    return await this.em
      .getRepository(Tournament)
      .findOneOrFail({
        where: {
          name
        }
      })
  }

  async getCurrentTournamentRound(): Promise<TournamentRound> {
    const tournament = await this.getActiveTournament();
    const tournamentId = tournament.id;

    return await this.em
      .getRepository(TournamentRound)
      .findOneOrFail({
        relations: ['tournament'],
        where: {
          tournamentId
        },
        order: {
          roundNumber: "DESC"
        }
      });
  }


  async getInviteList(
    roundId?: number
  ): Promise<Array<TournamentRoundInvite> | undefined> {
    let tournamentRoundId;
    if (roundId) {
      tournamentRoundId = roundId;
    } else {
      const tournamentRound = await this.getCurrentTournamentRound();
      if (tournamentRound === undefined) return undefined;
      tournamentRoundId = tournamentRound.id;
    }

    return await this.em.getRepository(TournamentRoundInvite)
      .find({
        tournamentRoundId: Equal(tournamentRoundId)
      });
  }

  async createInvites(userIds: Array<number>, tournamentRoundId: number): Promise<Array<TournamentRoundInvite>> {
    const invites = userIds.map(userId => this.em.getRepository(TournamentRoundInvite).create({ userId, tournamentRoundId }));
    return await this.em.getRepository(TournamentRoundInvite).save(invites);
  }

  async createInvite(userId: number, tournamentRoundId: number): Promise<TournamentRoundInvite> {
    const repository = this.em.getRepository(TournamentRoundInvite);
    const invite = repository.create({ userId, tournamentRoundId });
    return await repository.save(invite);
  }


  async getActiveRoundInvite(userId: number, tournamentRound: TournamentRound): Promise<TournamentRoundInvite> {
    const tournamentRoundId = tournamentRound.id;
    const invite = await this.em.getRepository(TournamentRoundInvite).findOne({
      where: {
        tournamentRoundId,
        userId
      }
    });
    if (invite) return invite;

    // special case for the first round of a tournament where everyone's invited 
    if (!invite && tournamentRound.roundNumber === 1) {
      return await this.createInvite(userId, tournamentRoundId);
    }
    else {
      throw new EntityNotFoundError(TournamentRoundInvite, `User ${userId} does not have an invite for the current round ${tournamentRoundId}.`);
    }
  }

  async createTournament(data: Pick<Tournament, 'name' | 'active'>): Promise<Tournament> {
    const t = this.em.getRepository(Tournament).create(data);
    return await this.em.save(t)
  }

  async createRound(data: Pick<TournamentRound, 'exitSurveyUrl' | 'introSurveyUrl' | 'startDate' | 'endDate' | 'roundNumber'> & { tournamentId?: number }): Promise<TournamentRound> {
    if (!data.tournamentId) {
      data.tournamentId = (await this.em.getRepository(Tournament).createQueryBuilder('tournament').select('id').where({ active: true }).getRawOne()).id;
    }

    const tr = new TournamentRound();
    Object.assign(tr, data);

    return await this.em.getRepository(TournamentRound).save(tr);
  }

  async findRoundWinners(
    roundId?: number
  ): Promise<Array<number> | undefined> {
    // NOTE: Get Tournament Round ID
    let tournamentRoundId;
    if (roundId) {
      tournamentRoundId = roundId;
    } else {
      const tournamentRound = await this.getCurrentTournamentRound();
      if (tournamentRound === undefined) return undefined;
      tournamentRoundId = tournamentRound.id;
    }

    // NOTE: Get Games
    const games: Array<Game> | undefined = await this.em
      .getRepository(Game)
      .find({ tournamentRoundId: Equal(tournamentRoundId) });
    if (games === undefined) {
      return undefined;
    }

    // NOTE: Get Winners from Games
    const winnerIds: Array<number> = [];

    for (const game of games) {
      // NOTE: Get Players from Games
      const gameId: number = game.id;
      const players: Array<Player> = await this.em
        .getRepository(Player)
        .find({
          gameId: Equal(gameId)
        });
      if (players === undefined) {
        return undefined;
      }

      // NOTE: Get Winners from Players
      const playerPoints: Array<[number, number | null]> = [];
      const winners: Array<number> = [];

      for (const player of players) {
        playerPoints.push([player.userId, player.points]);
      }

      const sorted = _.reverse(_.sortBy(playerPoints, [1]));
      sorted.forEach((s: [number, number | null]) => {
        if (s[1] === sorted[0][1]) winners.push(s[0]);
      })
    }


    return undefined;
  }

  findQBAlternateCandidates(qb: SelectQueryBuilder<any>, tournamentRoundId: number): SelectQueryBuilder<any> {
    return qb
      .select('player.id', 'id')
      .addSelect('player.userId', 'userId')
      .addSelect('player.score', 'score')
      .addSelect('rank() over (partition by player.userId order by player.score desc)', 'rank')
      .addSelect('game.id', 'gameId')
      .from(Player, 'player')
      .innerJoinAndSelect('player.game', 'game')
      .where('game.tournamentRoundId = :tournamentRoundId', { tournamentRoundId })
      .orderBy('u.rank', 'DESC')
      .addOrderBy('u.score', 'DESC');
  }

  async findAlternativeCandidates(tournamentRoundId: number, n: number) {
    return this.em.createQueryBuilder()
      .from(qb => this.findQBAlternateCandidates(qb, tournamentRoundId).getQuery(), 'u')
      .distinctOn(['u.userId'])
      .limit(n)
      .select('u.userId', 'id');
  }

  async getTournamentRoundInvite(id: number): Promise<TournamentRoundInvite> {
    return this.em.getRepository(TournamentRoundInvite).findOneOrFail({ relations: ['user', 'tournamentRound'], where: { id } });
  }

  async getTournamentRound(id: number): Promise<TournamentRound> {
    return this.em.getRepository(TournamentRound).findOneOrFail({ where: { id } });
  }

  async setSurveyComplete(data: { inviteId: number; surveyId: string }) {
    const invite = await this.getTournamentRoundInvite(data.inviteId);
    const tournamentRound = invite.tournamentRound;
    const introSurveyUrl = tournamentRound.introSurveyUrl;
    const exitSurveyUrl = tournamentRound.exitSurveyUrl;
    if (introSurveyUrl && introSurveyUrl.includes(data.surveyId)) {
      invite.hasCompletedIntroSurvey = true;
      logger.debug("participant %s completed intro survey %s", invite.user.username, introSurveyUrl);
    }
    else if (exitSurveyUrl && exitSurveyUrl.includes(data.surveyId)) {
      invite.hasCompletedExitSurvey = true;
      logger.debug("participant %s completed exit survey %s", invite.user.username, exitSurveyUrl);
    }
    this.em.save(invite);
  }
}

interface RoundWinners {
  roundId: number;
  gameId: number;
  winners: Array<number>;
}