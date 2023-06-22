import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ThresholdInformation } from "@port-of-mars/shared/sologame/types";

@Entity()
export class SoloGameTreatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  isKnownNumberOfRounds!: boolean;

  @Column()
  isEventDeckKnown!: boolean;

  @Column({
    type: "enum",
    enum: ["unknown", "range", "known"],
  })
  thresholdInformation!: ThresholdInformation;
}
