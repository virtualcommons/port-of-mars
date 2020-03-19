import {settings} from '@port-of-mars/server/settings';
import {EntityManager, getConnection} from "typeorm";
import {User} from "@port-of-mars/server/entity/User";
import {TournamentService} from "@port-of-mars/server/services/tournament";

const logger = settings.logging.getLogger(__filename);

export class AuthService {
  constructor(public em: EntityManager) {}

  async checkUserCanPlayGame(userId: number, tournamentRoundId?: number): Promise<boolean | undefined> {
    if (!tournamentRoundId) {
      const ts = new TournamentService(this.em);
      tournamentRoundId = (await ts.getCurrentTournamentRound())?.id
    }
    const r = await this.em
      .createQueryBuilder()
      .from(User, 'user')
      .innerJoin('user.invites', 'invite')
      .innerJoin('invite.tournamentRound', 'round')
      .where(`user.id = :userId and round.id = :tournamentRoundId and not invite.hasParticipated`, {userId, tournamentRoundId})
      .select('count(*) > 0', 'n')
      .getRawOne();
    return r?.n ? r.n : false;
  }
}