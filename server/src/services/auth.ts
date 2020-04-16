import { settings } from '@port-of-mars/server/settings';
import { User } from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";

const logger = settings.logging.getLogger(__filename);

export class AuthService extends BaseService {
  async checkUserCanPlayGame(userId: number, tournamentRoundId?: number): Promise<boolean | undefined> {
    if (!tournamentRoundId) {
      const ts = this.sp.tournament;
      tournamentRoundId = (await ts.getCurrentTournamentRound())?.id
    }
    const r = await this.em
      .createQueryBuilder()
      .from(User, 'user')
      .innerJoin('user.invites', 'invite')
      .innerJoin('invite.tournamentRound', 'round')
      .where(`user.id = :userId and round.id = :tournamentRoundId and not invite.hasParticipated and user.passedQuiz`, { userId, tournamentRoundId })
      .select('count(*) > 0', 'n')
      .getRawOne();
    return r?.n ? r.n : false;
  }
}