import { BaseService } from "@port-of-mars/server/services/db";
import {
  EventCardData,
  SoloGameStatus,
  SoloGameType,
  TreatmentData,
} from "@port-of-mars/shared/sologame";
import {
  SoloGame,
  SoloGameRound,
  SoloGameTreatment,
  SoloMarsEventCard,
  SoloMarsEventDeck,
  SoloMarsEventDeckCard,
  SoloPlayer,
  SoloPlayerDecision,
  User,
} from "@port-of-mars/server/entity";
import { getRandomIntInclusive } from "@port-of-mars/server/util";
import { SoloGameState } from "@port-of-mars/server/rooms/sologame/state";
import { createObjectCsvWriter } from "csv-writer";
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export class SoloGameService extends BaseService {
  async drawEventCardDeck(gameType: SoloGameType): Promise<EventCardData[]> {
    /**
     * draw a deck of event cards from the db (ordered by id)
     */
    const cards = await this.em.getRepository(SoloMarsEventCard).find({
      where: { gameType },
      order: { id: "ASC" },
    });
    const deck: EventCardData[] = [];

    for (const card of cards) {
      const drawAmt = getRandomIntInclusive(card.drawMin, card.drawMax);
      for (let i = 0; i < drawAmt; i++) {
        // card effects are encoded in the db with a range of possible rolls and
        // a multiplier for each value (sys health, points, .. ), this is typically
        // 0, 1 or -1
        const roll = getRandomIntInclusive(card.rollMin, card.rollMax);
        // fill out templates from the db with the actual roll value and pluralization
        const effectText = card.effect
          .replace("{roll}", roll.toString())
          .replace("{s}", roll === 1 ? "" : "s");

        deck.push({
          id: card.id,
          codeName: card.codeName,
          displayName: card.displayName,
          flavorText: card.flavorText,
          effectText,
          pointsEffect: card.pointsMultiplier * roll,
          resourcesEffect: card.resourcesMultiplier * roll,
          systemHealthEffect: card.systemHealthMultiplier * roll,
        });
      }
    }

    return deck;
  }

  async getUserNextFreeplayTreatment(userId: number): Promise<TreatmentData> {
    /**
     * get the next treatment (in order) that a user has not yet seen. If they have seen all
     * then return a random one.
     */
    const gameType = "freeplay";
    const treatmentRepo = this.em.getRepository(SoloGameTreatment);
    const availableTreatmentIds = (
      await treatmentRepo.find({
        select: ["id"],
        where: { gameType },
      })
    ).map(t => t.id);
    const numTreatments = availableTreatmentIds.length;

    if (numTreatments === 0) {
      throw new Error(`No treatments found for solo game type: ${gameType}`);
    }

    const highestPlayedTreatment = (
      await this.em
        .getRepository(User)
        .createQueryBuilder("user")
        .leftJoin("user.soloPlayers", "soloPlayer")
        .leftJoin("soloPlayer.game", "soloGame")
        .select("COALESCE(MAX(soloGame.treatmentId), 0)", "max")
        .where("user.id = :userId", { userId })
        .andWhere("soloGame.status != :status", { status: "incomplete" })
        .andWhere("soloGame.treatmentId IN (:...availableTreatmentIds)", {
          availableTreatmentIds,
        })
        .getRawOne()
    ).max;

    if (highestPlayedTreatment < numTreatments) {
      return treatmentRepo.findOneByOrFail({ id: highestPlayedTreatment + 1 });
    }
    const randomTreatmentId = availableTreatmentIds[getRandomIntInclusive(0, numTreatments - 1)];
    return treatmentRepo.findOneByOrFail({ id: randomTreatmentId });
  }

  async getRandomTreatment(gameType: SoloGameType): Promise<TreatmentData> {
    /**
     * get a random treatment for a given game type
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

  async getTreatmentById(id: number): Promise<TreatmentData> {
    return this.em.getRepository(SoloGameTreatment).findOneByOrFail({ id });
  }

  async createGame(state: SoloGameState): Promise<SoloGame> {
    /**
     * create a new SoloGame in the db and return it
     */
    const gameRepo = this.em.getRepository(SoloGame);
    const playerRepo = this.em.getRepository(SoloPlayer);
    const player = await this.createPlayer(state.player.userId);
    const game = gameRepo.create({
      player,
      type: state.type,
      treatment: await this.findTreatment(state.treatmentParams),
      deck: await this.createDeck(state.eventCardDeck),
      status: state.status,
      maxRound: state.maxRound,
      twoEventsThreshold: state.twoEventsThreshold,
      threeEventsThreshold: state.threeEventsThreshold,
    });
    await gameRepo.save(game);
    player.gameId = game.id;
    await playerRepo.save(player);
    return gameRepo.findOneOrFail({
      where: { id: game.id },
      relations: {
        deck: {
          cards: true,
        },
      },
    });
  }

  async createPlayer(userId: number): Promise<SoloPlayer> {
    const repo = this.em.getRepository(SoloPlayer);
    const player = repo.create({
      userId: userId,
    });
    await repo.save(player);
    return player;
  }

  async findTreatment(treatmentData: TreatmentData): Promise<SoloGameTreatment> {
    return this.em.getRepository(SoloGameTreatment).findOneOrFail({
      where: {
        gameType: treatmentData.gameType,
        isNumberOfRoundsKnown: treatmentData.isNumberOfRoundsKnown,
        isEventDeckKnown: treatmentData.isEventDeckKnown,
        thresholdInformation: treatmentData.thresholdInformation,
        isLowResSystemHealth: treatmentData.isLowResSystemHealth,
      },
    });
  }

  async createDeck(cardData: EventCardData[]): Promise<SoloMarsEventDeck> {
    const deckCardRepo = this.em.getRepository(SoloMarsEventDeckCard);
    const deckRepo = this.em.getRepository(SoloMarsEventDeck);
    const deck = deckRepo.create({});
    await deckRepo.save(deck);
    for (const card of cardData) {
      const deckCard = deckCardRepo.create({
        deck,
        deckId: deck.id,
        cardId: card.id,
        effectText: card.effectText,
        systemHealthEffect: card.systemHealthEffect,
        pointsEffect: card.pointsEffect,
        resourcesEffect: card.resourcesEffect,
      });
      await deckCardRepo.save(deckCard);
    }
    return deck;
  }

  async updateGameStatus(gameId: number, status: SoloGameStatus) {
    const repo = this.em.getRepository(SoloGame);
    const game = await repo.findOneByOrFail({ id: gameId });
    game.status = status;
    await repo.save(game);
  }

  async updatePlayerPoints(
    gameId: number,
    points: number,
    maxRound: number,
    status: SoloGameStatus
  ) {
    const repo = this.em.getRepository(SoloPlayer);
    const player = await repo.findOneByOrFail({ gameId });
    player.points = points;
    await repo.save(player);
    // if the game was a success, update the player's highscore table as well
    if (status === "victory") {
      await this.sp.leaderboard.updateSoloHighScore(gameId, points, maxRound);
    }
  }

  async createRound(
    state: SoloGameState,
    systemHealthInvestment: number,
    pointsInvestment: number
  ) {
    /**
     * finalize/persist a game round by creating a new SoloGameRound tied to the SoloGame
     * with id = gameId
     */
    const roundRepo = this.em.getRepository(SoloGameRound);
    const decisionRepo = this.em.getRepository(SoloPlayerDecision);
    const deckCardRepo = this.em.getRepository(SoloMarsEventDeckCard);
    const decision = decisionRepo.create({
      systemHealthInvestment,
      pointsInvestment,
    });
    await decisionRepo.save(decision);
    const round = roundRepo.create({
      gameId: state.gameId,
      roundNumber: state.round,
      initialSystemHealth: state.roundInitialSystemHealth,
      initialPoints: state.roundInitialPoints,
      decision,
    });
    await roundRepo.save(round);

    // additionally, set the round on all cards that were drawn this round
    const cards = state.roundEventCards;
    for (const card of cards) {
      const deckCard = await deckCardRepo.findOneByOrFail({ id: card.deckCardId });
      if (deckCard) {
        deckCard.round = round;
        await deckCardRepo.save(deckCard);
      }
    }
    return round;
  }

  async getGameIds(type: SoloGameType, start?: Date, end?: Date): Promise<Array<number>> {
    /**
     * get all game ids for games of a certain type that were created between start and end
     */
    let query = this.em
      .getRepository(SoloGame)
      .createQueryBuilder("game")
      .select("game.id")
      .where("game.type = :type", { type });
    if (start && end) {
      query = query.andWhere("game.dateCreated BETWEEN :start AND :end", {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
      });
    }
    const result = await query.getRawMany();
    return result.map(row => row.game_id);
  }

  async exportGamesCsv(path: string, gameIds?: Array<number>) {
    /**
     * export a flat csv of past games specified by gameIds,
     * or all games if gameIds is undefined
     * gameId, userId. username, status, points, dateCreated, ...treatment
     */
    let query = this.em
      .getRepository(SoloGame)
      .createQueryBuilder("game")
      .leftJoinAndSelect("game.player", "player")
      .leftJoinAndSelect("player.user", "user")
      .leftJoinAndSelect("game.treatment", "treatment");
    if (gameIds && gameIds.length > 0) {
      query = query.where("game.id IN (:...gameIds)", { gameIds });
    }
    try {
      const games = await query.getMany();
      const formattedGames = games.map(game => ({
        gameId: game.id,
        gameType: game.type,
        userId: game.player.user.id,
        username: game.player.user.username,
        status: game.status,
        points: game.player.points,
        maxRound: game.maxRound,
        twoEventsThreshold: game.twoEventsThreshold,
        threeEventsThreshold: game.threeEventsThreshold,
        knownEventDeck: game.treatment.isEventDeckKnown,
        knownEndRound: game.treatment.isNumberOfRoundsKnown,
        thresholdInformation: game.treatment.thresholdInformation,
        isLowResSystemHealth: game.treatment.isLowResSystemHealth,
        dateCreated: game.dateCreated.toISOString(),
      }));
      const header = Object.keys(formattedGames[0]).map(name => ({
        id: name,
        title: name,
      }));
      const writer = createObjectCsvWriter({ path, header });
      await writer.writeRecords(formattedGames);
      logger.info(`Solo game data exported successfully to ${path}`);
    } catch (error) {
      logger.fatal(`Error exporting solo game data: ${error}`);
    }
  }

  async exportEventCardsCsv(path: string, gameIds?: Array<number>) {
    /**
     * export a flat csv of all event cards drawn in past games specified by gameIds
     * or all games if gameIds is undefined
     *
     * gameId, cardId, roundId, roundNumber, name, effectText, systemHealthEffect,
     * resourcesEffect, pointsEffect
     */
    let query = this.em
      .getRepository(SoloMarsEventDeckCard)
      .createQueryBuilder("deckCard")
      .leftJoinAndSelect("deckCard.round", "round")
      .leftJoinAndSelect("round.game", "game")
      .leftJoinAndSelect("deckCard.card", "eventCard")
      .where("round.gameId IS NOT NULL");
    if (gameIds && gameIds.length > 0) {
      query = query.andWhere("game.id IN (:...gameIds)", { gameIds });
    }
    try {
      const deckCards = await query.getMany();
      const formattedDeckCards = deckCards.map(deckCard => ({
        gameId: deckCard.round.gameId,
        cardId: deckCard.id,
        roundId: deckCard.round.id,
        roundNumber: deckCard.round.roundNumber,
        name: deckCard.card.displayName,
        effectText: deckCard.effectText,
        systemHealthEffect: deckCard.systemHealthEffect,
        resourcesEffect: deckCard.resourcesEffect,
        pointsEffect: deckCard.pointsEffect,
      }));
      let header: any[] = [];
      // if there are no cards, just write an empty file
      if (formattedDeckCards.length > 0) {
        header = Object.keys(formattedDeckCards[0]).map(name => ({
          id: name,
          title: name,
        }));
      }
      const writer = createObjectCsvWriter({ path, header });
      await writer.writeRecords(formattedDeckCards);
      logger.info(`Event cards data exported successfully to ${path}`);
    } catch (error) {
      logger.fatal(`Error exporting event cards data: ${error}`);
    }
  }

  async exportInvestmentsCsv(path: string, gameIds?: Array<number>) {
    /**
     * export a flat csv of all player-made investments in past games specified by gameIds
     * or all games if gameIds is undefined
     *
     * gameId, roundId, roundNumber, initialSystemHealth, initialPoints,
     * systemHealthInvestment, pointsInvestment, dateCreated
     *
     * initial values are the values at the start of each round AFTER wear
     * and tear has been applied
     */
    let query = this.em
      .getRepository(SoloGameRound)
      .createQueryBuilder("round")
      .leftJoinAndSelect("round.game", "game")
      .leftJoinAndSelect("round.decision", "decision")
      .where("round.gameId IS NOT NULL");
    if (gameIds && gameIds.length > 0) {
      query = query.andWhere("game.id IN (:...gameIds)", { gameIds });
    }
    try {
      const rounds = await query.getMany();
      const formattedRounds = rounds.map(round => ({
        gameId: round.gameId,
        roundId: round.id,
        roundNumber: round.roundNumber,
        initialSystemHealth: round.initialSystemHealth,
        initialPoints: round.initialPoints,
        systemHealthInvestment: round.decision.systemHealthInvestment,
        pointsInvestment: round.decision.pointsInvestment,
        dateCreated: round.dateCreated.toISOString(),
      }));
      const header = Object.keys(formattedRounds[0]).map(name => ({
        id: name,
        title: name,
      }));
      const writer = createObjectCsvWriter({ path, header });
      await writer.writeRecords(formattedRounds);
      logger.info(`Investment data exported successfully to ${path}`);
    } catch (error) {
      logger.fatal(`Error exporting investment data: ${error}`);
    }
  }
}
