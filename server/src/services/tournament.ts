import {getConnection} from '@port-of-mars/server/util';
import {Tournament} from '@port-of-mars/server/entity/Tournament.ts';
import {TournamentRound} from '@port-of-mars/server/entity/TournamentRound.ts';
import {TournamentRoundInvite} from '@port-of-mars/server/entity/TournamentRoundInvite.ts';
import {Player} from '@port-of-mars/server/entity/Player.ts';
import {Game} from '@port-of-mars/server/entity/Game.ts';
import {Connection, EntityManager, Equal, SelectQueryBuilder} from 'typeorm';
import * as _ from 'lodash';
import {User} from "@port-of-mars/server/entity/User";
import {settings} from "@port-of-mars/server/settings";

const logger = settings.logging.getLogger(__filename);

export class TournamentService {
  em: EntityManager;

  constructor(em?: EntityManager) {
    if (!em) {
      em = getConnection().manager
    }
    this.em = em;
  }

  async getActiveTournament(): Promise<Tournament | undefined> {
    return await this.em
      .getRepository(Tournament)
      .findOne({
        active: true
      });
  }

  async getCurrentTournamentRound(): Promise<TournamentRound | undefined> {
    const tournament = await this.getActiveTournament();
    if (tournament === undefined) return undefined;
    const tournamentId = tournament.id;

    return await this.em
      .getRepository(TournamentRound)
      .createQueryBuilder('tournamentRound')
      .where('tournamentRound.tournamentId = :tournamentId', {tournamentId})
      .orderBy('tournamentRound.roundNumber', 'DESC')
      .getOne();
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

  async createTournament(data: Pick<Tournament, 'name' | 'active'>): Promise<Tournament> {
    const t = this.em.getRepository(Tournament).create(data);
    return await this.em.save(t)
  }

  async createRound(data: Pick<TournamentRound, 'exitSurveyUrl' | 'introSurveyUrl' | 'startDate' | 'endDate' | 'roundNumber'> & { tournamentId?: number }): Promise<TournamentRound> {
    if (!data.tournamentId) {
      data.tournamentId = (await this.em.getRepository(Tournament).createQueryBuilder('tournament').select('id').where({active: true}).getRawOne()).id;
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
      .find({tournamentRoundId: Equal(tournamentRoundId)});
    if (games === undefined) {
      return undefined;
    }

    // NOTE: Get Winners from Games
    let winnerIds: Array<number> = [];

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
      let playerPoints: Array<[number, number | null]> = [];
      let winners: Array<number> = [];

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
      .where('game.tournamentRoundId = :tournamentRoundId', {tournamentRoundId})
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
}

interface RoundWinners {
  roundId: number;
  gameId: number;
  winners: Array<number>;
}