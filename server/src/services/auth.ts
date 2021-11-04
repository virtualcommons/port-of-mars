import { settings } from '@port-of-mars/server/settings';
import { User } from "@port-of-mars/server/entity";
import {BaseService} from "@port-of-mars/server/services/db";

const logger = settings.logging.getLogger(__filename);

export class AuthService extends BaseService {
  async checkUserCanPlayGame(userId: number, tournamentRoundId?: number): Promise<boolean> {
    if (!tournamentRoundId) {
      const tournamentService = this.sp.tournament;
      const currentRound = await tournamentService.getCurrentTournamentRound();
      tournamentRoundId = currentRound.id;
    }
    // check that the given User has a valid TournamentRoundInvite 
    // that hasn't already been marked as participated
    const result = await this.em
      .createQueryBuilder()
      .from(User, 'user')
      .innerJoin('user.invites', 'invite')
      .innerJoin('invite.tournamentRound', 'round')
      .where(`user.id = :userId and round.id = :tournamentRoundId and not invite.hasParticipated`, { userId, tournamentRoundId })
      .select('count(*) > 0', 'validInvitation')
      .getRawOne();
    logger.info("user %s can play the game? %o", userId, result?.validInvitation);
    return result?.validInvitation ? result.validInvitation : false;
  }
}