import { BaseService } from "@port-of-mars/server/services/db";
import { EventCardData, SoloGameStatus, TreatmentData } from "@port-of-mars/shared/sologame";
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
import { getLogger } from "@port-of-mars/server/settings";

const logger = getLogger(__filename);

export class SoloGameService extends BaseService {
  async drawEventCardDeck(): Promise<EventCardData[]> {
    /**
     * draw a deck of event cards from the db
     */
    const cards = await this.em.getRepository(SoloMarsEventCard).find();
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

  async getUserRemainingTreatments(userId: number): Promise<Array<number>> {
    /**
     * get the treatment Ids that a user has not yet played a game with. If they
     * have played all the treatments, return the full range
     */
    const numTreatments = await this.em.getRepository(SoloGameTreatment).count();
    const allTreatments = Array.from({ length: numTreatments }, (_, i) => i + 1);
    const playedTreatments = await this.em
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoin("user.soloPlayers", "soloPlayer")
      .leftJoin("soloPlayer.game", "soloGame")
      .select("soloGame.treatmentId")
      .where("user.id = :userId", { userId })
      .getRawMany();

    if (!playedTreatments || playedTreatments.length === 0) {
      return allTreatments;
    }
    const playedTreatmentIds = playedTreatments.map(pt => pt.treatmentId).filter(Boolean);

    if (playedTreatmentIds.length === numTreatments) {
      return allTreatments;
    }
    return allTreatments.filter(id => !playedTreatmentIds.includes(id));
  }

  async getTreatmentById(id: number): Promise<TreatmentData> {
    return this.em.getRepository(SoloGameTreatment).findOneOrFail(id);
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
      treatment: await this.findTreatment(state.treatmentParams),
      deck: await this.createDeck(state.eventCardDeck),
      status: state.status,
      twoCardThreshold: state.twoCardThreshold,
      threeCardThreshold: state.threeCardThreshold,
    });
    await gameRepo.save(game);
    player.gameId = game.id;
    await playerRepo.save(player);
    return gameRepo.findOneOrFail(game.id, { relations: ["deck", "deck.cards"] });
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
        isKnownNumberOfRounds: treatmentData.isKnownNumberOfRounds,
        isEventDeckKnown: treatmentData.isEventDeckKnown,
        thresholdInformation: treatmentData.thresholdInformation,
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
    const game = await repo.findOneOrFail(gameId);
    game.status = status;
    await repo.save(game);
  }

  async updatePlayerPoints(gameId: number, points: number) {
    const repo = this.em.getRepository(SoloPlayer);
    const player = await repo.findOneOrFail({ gameId });
    player.points = points;
    await repo.save(player);
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
      decision,
    });
    await roundRepo.save(round);

    // additionally, set the round on all cards that were drawn this round
    const cards = state.roundEventCards;
    for (const card of cards) {
      const deckCard = await deckCardRepo.findOneOrFail({ id: card.deckCardId });
      if (deckCard) {
        deckCard.round = round;
        await deckCardRepo.save(deckCard);
      }
    }
    return round;
  }
}
