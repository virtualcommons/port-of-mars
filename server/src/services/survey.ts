import { User } from '@port-of-mars/server/entity/User';
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { TournamentRoundInvite } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { getLogger, settings } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);


// FIXME: created from the survey related code in the old dashboard service, should be refactored
// if/when surveys will be used again in a tournament or otherwise
export class SurveyService extends BaseService {

  /**
   * generate a parameterized survey URL with pid=participantId and tid=tournamentRoundInvite.id
   * @param round 
   * @param invite 
   */
  getIntroSurveyUrl(user: User, round: TournamentRound, invite: TournamentRoundInvite | undefined): string {
    return this.buildSurveyUrl(round.introSurveyUrl, user, invite);
  }

  getExitSurveyUrl(user: User, round: TournamentRound, invite: TournamentRoundInvite | undefined): string {
    return this.buildSurveyUrl(round.exitSurveyUrl, user, invite);
  }

  buildSurveyUrl(surveyUrl: string | undefined, user: User, invite: TournamentRoundInvite | undefined): string {
    if (invite && surveyUrl) {
      surveyUrl = `${surveyUrl}?pid=${user.participantId}&tid=${invite.id}&redirectHost=${encodeURIComponent(settings.host)}`;
    }
    return surveyUrl ?? '';
  }

}
