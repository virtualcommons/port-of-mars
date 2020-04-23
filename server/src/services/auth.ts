import { settings } from '@port-of-mars/server/settings';
import { User } from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";

const logger = settings.logging.getLogger(__filename);

export class AuthService extends BaseService {
  async checkUserCanPlayGame(userId: number, tournamentRoundId?: number): Promise<boolean> {
    if (!tournamentRoundId) {
      const tournamentService = this.sp.tournament;
      tournamentRoundId = (await tournamentService.getCurrentTournamentRound())?.id
    }

    // select TournamentRoundInvite. 
    const r = await this.em
      .createQueryBuilder()
      .from(User, 'user')
      .innerJoin('user.invites', 'invite')
      .innerJoin('invite.tournamentRound', 'round')
      .where(`user.id = :userId and round.id = :tournamentRoundId and not invite.hasParticipated and user.passedQuiz`, { userId, tournamentRoundId })
      .select('count(*) > 0', 'n')
      .getRawOne();
    logger.info("user %s can play the game? %o", userId, r?.n);
    return r?.n ? r.n : false;
  }
}