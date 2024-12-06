import {
  ProlificStudy,
  ProlificStudyParticipant,
  SoloGameTreatment,
  SoloPlayer,
  User,
} from "@port-of-mars/server/entity";
import { Repository } from "typeorm";
import { settings } from "@port-of-mars/server/settings";
import { BaseService } from "@port-of-mars/server/services/db";
import { generateUsername, getRandomIntInclusive, ServerError } from "@port-of-mars/server/util";
import { SoloGameType } from "@port-of-mars/shared/sologame";
import {
  ProlificParticipantPointData,
  ProlificParticipantStatus,
  ProlificStudyData,
} from "@port-of-mars/shared/types";
import { createObjectCsvWriter } from "csv-writer";

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
    const participant = await this.getParticipantRepository().findOneOrFail({
      where: { userId: user.id },
      relations: ["prolificBaselineTreatment", "prolificVariableTreatment"],
    });

    let activeGameType: SoloGameType | null = null;
    let nextGameType: SoloGameType | null = "prolificBaseline";
    let nextGameInstructions = participant.prolificBaselineTreatment.instructions;
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
        nextGameInstructions = participant.prolificVariableTreatment.instructions;
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
      nextGameInstructions,
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
      participant.prolificBaselineTreatment = await this.getRandomTreatmentFor("prolificBaseline");
      participant.prolificVariableTreatment = await this.getRandomTreatmentFor("prolificVariable");
      logger.info(`Created new prolific participant ${prolificId} for study ${studyId}`);
      await this.getParticipantRepository().save(participant);
    } else {
      logger.info(`Found existing prolific participant ${prolificId} for study ${studyId}`);
    }
    return participant;
  }

  async setProlificParticipantPlayer(
    gameType: Extract<SoloGameType, "prolificBaseline" | "prolificVariable">,
    player: SoloPlayer
  ): Promise<ProlificStudyParticipant> {
    const participant = await this.getParticipantRepository().findOneOrFail({
      where: { userId: player.userId },
      relations: [`${gameType}Player`],
    });
    if (gameType === "prolificBaseline") {
      participant.prolificBaselinePlayer = player;
    } else {
      participant.prolificVariablePlayer = player;
    }
    return this.getParticipantRepository().save(participant);
  }

  async getAllParticipantPoints(studyId: string): Promise<Array<ProlificParticipantPointData>> {
    const study = await this.getProlificStudy(studyId);
    if (!study) {
      throw new ServerError({
        code: 404,
        message: `Invalid study ID: ${studyId}`,
        displayMessage: `Invalid study ID: ${studyId}`,
      });
    }
    const participants = await this.getParticipantRepository().find({
      where: { studyId: study.id },
      relations: {
        prolificBaselinePlayer: {
          game: true,
        },
        prolificVariablePlayer: {
          game: true,
        },
      },
    });
    return (
      participants
        // filter out participants who haven't fully completed both games
        .filter(
          p =>
            p.prolificBaselinePlayer?.game &&
            p.prolificVariablePlayer?.game &&
            p.prolificBaselinePlayer.points !== null &&
            p.prolificBaselinePlayer.points !== undefined &&
            p.prolificVariablePlayer.points !== null &&
            p.prolificVariablePlayer.points !== undefined
        )
        // return an array of prolificId and total points earned, if they lost they get 0 points
        .map(p => {
          const prolificBaselinePoints =
            p.prolificBaselinePlayer.game.status === "victory"
              ? p.prolificBaselinePlayer.points!
              : 0;
          const prolificVariablePoints =
            p.prolificVariablePlayer.game.status === "victory"
              ? p.prolificVariablePlayer.points!
              : 0;
          return {
            prolificId: p.prolificId,
            points: prolificBaselinePoints + prolificVariablePoints,
          };
        })
    );
  }

  async getRandomTreatmentFor(
    gameType: Extract<SoloGameType, "prolificBaseline" | "prolificVariable">
  ): Promise<SoloGameTreatment> {
    /**
     * get a random treatment for a given prolific game type
     */
    const treatmentRepo = this.em.getRepository(SoloGameTreatment);
    const treatments = await treatmentRepo.find({
      where: { gameType },
    });
    if (treatments.length === 0) {
      throw new Error(`No treatments found for solo game type: ${gameType}`);
    }
    return treatments[getRandomIntInclusive(0, treatments.length - 1)];
  }

  async getTreatmentForUser(
    user: User,
    gameType: Extract<SoloGameType, "prolificBaseline" | "prolificVariable">
  ): Promise<SoloGameTreatment> {
    /**
     * get the treatment that a given user is assigned to for a given prolific game type
     */
    const participant = await this.getParticipantRepository().findOne({
      where: { userId: user.id },
      relations: ["prolificBaselineTreatment", "prolificVariableTreatment"],
    });
    if (!participant) {
      throw new ServerError({
        code: 404,
        message: "Participant not found",
        displayMessage: "Participant not found",
      });
    }
    return gameType === "prolificBaseline"
      ? participant.prolificBaselineTreatment
      : participant.prolificVariableTreatment;
  }

  async getProlificStudy(studyId: string): Promise<ProlificStudy | null> {
    return this.getRepository().findOneBy({ studyId });
  }

  async getAllProlificStudies(): Promise<ProlificStudyData[]> {
    try {
      const studies = await this.getRepository().find();

      return studies.map((study: ProlificStudy) => ({
        description: study.description || "",
        studyId: study.studyId,
        completionCode: study.completionCode,
        isActive: study.isActive,
      }));
    } catch (error) {
      console.error("Error fetching all prolific studies:", error);
      throw new ServerError({
        code: 500,
        message: "Failed to fetch all prolific studies",
        displayMessage: "Unable to retrieve studies at this time.",
      });
    }
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
    description?: string,
    isActive = true
  ): Promise<ProlificStudy> {
    const repo = this.getRepository();
    const study = repo.create({
      studyId,
      completionCode,
      description,
      isActive,
    });
    return repo.save(study);
  }

  async deleteProlificStudy(studyId: string): Promise<void> {
    const study = await this.getRepository().findOneBy({ studyId });
    if (!study) {
      throw new Error(`Study with ID ${studyId} not found.`);
    }
    await this.getRepository().remove(study);
  }

  async updateProlificStudy(
    studyId: string,
    completionCode: string,
    description?: string,
    isActive = true
  ): Promise<ProlificStudy> {
    logger.debug(`Updating study ${studyId}`);
    const repo = this.getRepository();
    const study = await repo.findOneBy({ studyId });
    if (!study) {
      throw new Error(`Study with ID ${studyId} not found.`);
    }
    study.description = description || study.description;
    study.completionCode = completionCode;
    study.isActive = isActive;
    return repo.save(study);
  }

  async exportProlificGamesCsv(path: string, studyId: string) {
    /**
     * Exports a flat CSV of past games associated with the specified studies
     * Includes gameId, gameType, playerId, userId, username, studyId, prolificId,
     * status, points, dateCreated, and treatment details
     */
    const query = this.em
      .getRepository(ProlificStudyParticipant)
      .createQueryBuilder("participant")
      .leftJoinAndSelect("participant.user", "user")
      .leftJoinAndSelect("participant.study", "study")
      .leftJoinAndSelect("participant.prolificBaselinePlayer", "baselinePlayer")
      .leftJoinAndSelect("baselinePlayer.game", "baselineGame")
      .leftJoinAndSelect("baselineGame.treatment", "baselineTreatment")
      .leftJoinAndSelect("participant.prolificVariablePlayer", "variablePlayer")
      .leftJoinAndSelect("variablePlayer.game", "variableGame")
      .leftJoinAndSelect("variableGame.treatment", "variableTreatment")
      .where("study.studyId = :studyId", { studyId });

    const participants = await query.getMany();
    const formattedGames = [];

    for (const participant of participants) {
      const user = participant.user;
      const studyId = participant.study.studyId;
      const prolificId = participant.prolificId;

      const playerGames = [participant.prolificBaselinePlayer, participant.prolificVariablePlayer];

      for (const player of playerGames) {
        if (player && player.game) {
          const game = player.game;
          const treatment = game.treatment;
          formattedGames.push({
            gameId: game.id,
            gameType: game.type,
            playerId: player.id,
            userId: user.id,
            username: user.username,
            studyId,
            prolificId,
            status: game.status,
            points: player.points,
            maxRound: game.maxRound,
            treatmentId: treatment.id,
            twoEventsThreshold: game.twoEventsThreshold,
            threeEventsThreshold: game.threeEventsThreshold,
            knownEventDeck: treatment.isEventDeckKnown,
            knownEndRound: treatment.isNumberOfRoundsKnown,
            thresholdInformation: treatment.thresholdInformation,
            lowResSystemHealth: treatment.isLowResSystemHealth,
            dateCreated: game.dateCreated.toISOString(),
          });
        }
      }
    }
    if (formattedGames.length === 0) {
      logger.warn("No games found for the specified studies.");
      return;
    }
    const header = Object.keys(formattedGames[0]).map(name => ({ id: name, title: name }));
    const writer = createObjectCsvWriter({ path, header });
    await writer.writeRecords(formattedGames);
    logger.info(`Solo game data for study ${studyId} exported successfully to ${path}`);
  }

  async getGameIdsForStudyId(studyId: string): Promise<number[]> {
    const participants = await this.em
      .getRepository(ProlificStudyParticipant)
      .createQueryBuilder("participant")
      .leftJoinAndSelect("participant.prolificBaselinePlayer", "baselinePlayer")
      .leftJoinAndSelect("baselinePlayer.game", "baselineGame")
      .leftJoinAndSelect("participant.prolificVariablePlayer", "variablePlayer")
      .leftJoinAndSelect("variablePlayer.game", "variableGame")
      .leftJoinAndSelect("participant.study", "study")
      .where("study.studyId = :studyId", { studyId })
      .getMany();

    const gameIds = [];
    for (const participant of participants) {
      if (participant.prolificBaselinePlayer?.game) {
        gameIds.push(participant.prolificBaselinePlayer.game.id);
      }
      if (participant.prolificVariablePlayer?.game) {
        gameIds.push(participant.prolificVariablePlayer.game.id);
      }
    }
    return gameIds;
  }
}
