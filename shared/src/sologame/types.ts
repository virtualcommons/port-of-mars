export interface EventCardData {
  codeName: string;
  displayName: string;
  description: string;
  pointsDelta: number;
  resourcesDelta: number;
  systemHealthDelta: number;
}

export interface TreatmentData {
  isKnownNumberOfRounds: boolean;
  isEventDeckKnown: boolean;
  thresholdInformation: "unknown" | "range" | "known";
}
