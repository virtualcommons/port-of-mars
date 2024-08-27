import {
  ProlificStudy,
  ProlificStudyParticipant,
  SoloPlayer,
  User,
} from "@port-of-mars/server/entity";
import { Repository } from "typeorm";
import { settings } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import { generateUsername, ServerError } from "@port-of-mars/server/util";
import { SoloGameType } from "@port-of-mars/shared/sologame";
import { ProlificParticipantStatus } from "@port-of-mars/shared/types";

const logger = settings.logging.getLogger(__filename);

export class StudyService extends BaseService {
  getRepository(): Repository<ProlificStudy> {
    return this.em.getRepository(ProlificStudy);
  }

  getParticipantRepository(): Repository<ProlificStudyParticipant> {
    return this.em.getRepository(ProlificStudyParticipant);
  }

  getUserRepository(): Repository<User> {
    return this.em.getRepository(User);
  }

  async getProlificParticipantStatus(user: User): Promise<ProlificParticipantStatus> {
    const soloPlayers = await this.em.getRepository(SoloPlayer).find({
      where: { userId: user.id },
      relations: ["game"],
    });

    let activeGameType: SoloGameType | null = null;
    let nextGameType: SoloGameType | null = "prolificBaseline";
    const steps = [
      "START GAME 1",
      "PLAYING GAME 1/2",
      "START GAME 2",
      "PLAYING GAME 2/2",
      "FINISHED! THANK YOU FOR PARTICIPATING!",
    ];
    let currentStep = 1;

    const hasPlayedBaseline = !!soloPlayers.find(p => p.game.type === "prolificBaseline");
    const hasPlayedVariable = !!soloPlayers.find(p => p.game.type === "prolificVariable");
    if (hasPlayedVariable) {
      const hasCompletedVariable = !!soloPlayers.find(
        p =>
          p.game.type === "prolificVariable" &&
          (p.game.status === "victory" || p.game.status === "defeat")
      );
      if (hasCompletedVariable) {
        // game 2 completed
        currentStep = 5;
        activeGameType = null;
        nextGameType = null;
      } else {
        // game 2 started
        currentStep = 4;
        activeGameType = "prolificVariable";
        nextGameType = null;
      }
    } else if (hasPlayedBaseline) {
      const hasCompletedBaseline = !!soloPlayers.find(
        p =>
          p.game.type === "prolificBaseline" &&
          (p.game.status === "victory" || p.game.status === "defeat")
      );
      if (hasCompletedBaseline) {
        // game 1 completed
        currentStep = 3;
        activeGameType = null;
        nextGameType = "prolificVariable";
      } else {
        // game 1 started
        currentStep = 2;
        activeGameType = "prolificBaseline";
        nextGameType = null;
      }
    }

    return {
      activeGameType,
      nextGameType,
      progress: {
        max: steps.length,
        current: currentStep,
        label: steps[currentStep - 1],
      },
    };
  }

  async getOrCreateProlificParticipant(
    prolificId: string,
    studyId: string
  ): Promise<ProlificStudyParticipant> {
    const study = await this.getProlificStudy(studyId);
    if (!study) {
      throw new ServerError({
        code: 404,
        message: `Invalid study ID: ${studyId}`,
        displayMessage: `Invalid study ID: ${studyId}`,
      });
    }
    let participant = await this.getParticipantRepository().findOne({
      where: { prolificId, study: { studyId } },
      relations: ["user", "study"],
    });
    if (!participant) {
      // create a new user if not found
      const user = new User();
      user.username = await generateUsername();
      user.name = "";
      user.dateConsented = new Date(); // assuming this happens externally
      user.isSystemBot = false;
      await this.getUserRepository().save(user);
      // create a new participant record and link to user
      participant = new ProlificStudyParticipant();
      participant.user = user;
      participant.study = study;
      participant.prolificId = prolificId;
      logger.info(`Created new prolific participant ${prolificId} for study ${studyId}`);
      await this.getParticipantRepository().save(participant);
    } else {
      logger.info(`Found existing prolific participant ${prolificId} for study ${studyId}`);
    }
    return participant;
  }

  async getProlificStudy(studyId: string): Promise<ProlificStudy | null> {
    return this.getRepository().findOneBy({ studyId });
  }

  async getProlificCompletionUrl(user: User): Promise<string> {
    const participant = await this.getParticipantRepository().findOne({
      where: { userId: user.id },
      relations: ["study"],
    });
    if (!participant) {
      throw new ServerError({
        code: 404,
        message: "Participant not found",
        displayMessage: "Participant not found",
      });
    }
    // sanity check: make sure the user has played 2 games
    const numPlays = await this.em.getRepository(SoloPlayer).count({
      where: { userId: user.id },
      relations: ["game"],
    });
    if (numPlays < 2) {
      throw new ServerError({
        code: 403,
        message: "Study not complete",
        displayMessage: "Study not complete",
      });
    }
    return `https://app.prolific.co/submissions/complete?cc=${participant.study.completionCode}`;
  }

  async createProlificStudy(
    studyId: string,
    completionCode: string,
    description?: string
  ): Promise<ProlificStudy> {
    const repo = this.getRepository();
    const study = repo.create({
      studyId,
      completionCode,
      description,
    });
    return repo.save(study);
  }
}
