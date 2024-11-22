import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SoloGameType, ThresholdInformation } from "@port-of-mars/shared/sologame/types";

@Entity()
export class SoloGameTreatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "freeplay" })
  gameType!: SoloGameType;

  @Column()
  isNumberOfRoundsKnown!: boolean;

  @Column()
  isEventDeckKnown!: boolean;

  @Column({
    type: "enum",
    enum: ["unknown", "range", "known"],
  })
  thresholdInformation!: ThresholdInformation;

  @Column({ default: false })
  isLowResSystemHealth!: boolean;

  @Column({ nullable: true })
  instructions?: string;
}
