import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LiteGameType, ThresholdInformation } from "@port-of-mars/shared/lite/types";

export abstract class BaseLiteGameTreatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "freeplay" })
  gameType!: LiteGameType;

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

@Entity()
export class SoloGameTreatment extends BaseLiteGameTreatment {}

// @Entity()
// export class LiteGameTreatment extends BaseLiteGameTreatment {}
