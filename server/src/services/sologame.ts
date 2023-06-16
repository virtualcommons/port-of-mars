import { BaseService } from "@port-of-mars/server/services/db";
import { EventCardData, TreatmentData } from "@port-of-mars/shared/sologame";

export class SoloGameService extends BaseService {
  async drawEventCardDeck(): Promise<EventCardData[]> {
    return [
      {
        codeName: "test-1",
        displayName: "Test 1",
        description: "Gain 10 points",
        pointsDelta: 10,
        resourcesDelta: 0,
        systemHealthDelta: 0,
      },
      {
        codeName: "test-2",
        displayName: "Test 2",
        description: "Lose 3 resources",
        pointsDelta: 0,
        resourcesDelta: -3,
        systemHealthDelta: 0,
      },
      {
        codeName: "test-3",
        displayName: "Test 3",
        description: "Gain 5 resources",
        pointsDelta: 0,
        resourcesDelta: 5,
        systemHealthDelta: 0,
      },
      {
        codeName: "test-4",
        displayName: "Test 4",
        description: "Gain 10 system health",
        pointsDelta: 0,
        resourcesDelta: 0,
        systemHealthDelta: 10,
      },
      {
        codeName: "test-5",
        displayName: "Test 5",
        description: "Lose 5 system health",
        pointsDelta: 0,
        resourcesDelta: 0,
        systemHealthDelta: -5,
      },
      {
        codeName: "test-6",
        displayName: "Compulsive Philanthropy",
        description: "Invest 5 resources in system health",
        pointsDelta: 0,
        resourcesDelta: -5,
        systemHealthDelta: 5,
      },
      {
        codeName: "murphys-law",
        displayName: "Murphy's Law",
        description: "Draw 2 more cards",
        pointsDelta: 0,
        resourcesDelta: 0,
        systemHealthDelta: 0,
      },
    ];
  }

  async getUserRemainingTreatments(userId: number): Promise<Array<number>> {
    return [6];
  }

  async getTreatmentById(id: number): Promise<TreatmentData> {
    return {
      isKnownNumberOfRounds: true,
      isEventDeckKnown: true,
      thresholdInformation: "known",
    };
  }

  async getRandomTreatment(): Promise<TreatmentData> {
    return {
      isKnownNumberOfRounds: true,
      isEventDeckKnown: false,
      thresholdInformation: "range",
    };
  }
}
