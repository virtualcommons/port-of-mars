import { User } from "@port-of-mars/server/entity/User";
import { TournamentRound } from "@port-of-mars/server/entity/TournamentRound";
import { TournamentRoundInvite } from "@port-of-mars/server/entity";
import { BaseService } from "@port-of-mars/server/services/db";
import { settings, getLogger } from "@port-of-mars/server/settings";
import { isDevOrStaging } from "@port-of-mars/shared/settings";

const logger = getLogger(__filename);

export class SurveyService extends BaseService {
  /**
   * generate a parameterized survey URL with pid=participantId and tid=tournamentRoundInvite.id
   * @param round
   * @param invite
   */
  getIntroSurveyUrl(
    user: User,
    round: TournamentRound,
    invite: TournamentRoundInvite | undefined
  ): string {
    return this.buildSurveyUrl(round.introSurveyUrl, user, invite);
  }

  getExitSurveyUrl(
    user: User,
    round: TournamentRound,
    invite: TournamentRoundInvite | undefined
  ): string {
    return this.buildSurveyUrl(round.exitSurveyUrl, user, invite);
  }

  buildSurveyUrl(
    surveyUrl: string | undefined,
    user: User,
    invite: TournamentRoundInvite | undefined
  ): string {
    if (invite && surveyUrl) {
      surveyUrl = `${surveyUrl}?pid=${user.participantId}&tid=${
        invite.id
      }&redirectHost=${encodeURIComponent(settings.serverHost)}`;
    }
    return surveyUrl ?? "";
  }

  async setSurveyComplete(data: { inviteId: number; surveyId: string }) {
    const invite = await this.em
      .getRepository(TournamentRoundInvite)
      .findOneOrFail(data.inviteId, { relations: ["user", "tournamentRound"] });
    const tournamentRound = invite.tournamentRound;
    const introSurveyUrl = tournamentRound.introSurveyUrl;
    const exitSurveyUrl = tournamentRound.exitSurveyUrl;
    // for testing (dev or staging), allow marking complete without a survey id
    if (isDevOrStaging() || (introSurveyUrl && introSurveyUrl.includes(data.surveyId))) {
      invite.hasCompletedIntroSurvey = true;
      logger.debug(
        "participant %s completed intro survey %s",
        invite.user.username,
        introSurveyUrl || "no survey url?"
      );
    } else if (exitSurveyUrl && exitSurveyUrl.includes(data.surveyId)) {
      invite.hasCompletedExitSurvey = true;
      logger.debug("participant %s completed exit survey %s", invite.user.username, exitSurveyUrl);
    }
    this.em.save(invite);
  }
}
