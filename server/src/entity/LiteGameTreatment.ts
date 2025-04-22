import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import { SoloGameType, ThresholdInformation } from "@port-of-mars/shared/sologame/types";
  
export abstract class BaseLiteGameTreatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  isNumberOfRoundsKnown!: boolean;

  @Column()
  isEventDeckKnown!: boolean;

  @Column({ default: false })
  isLowResSystemHealth!: boolean;

  @Column({ nullable: true })
  instructions?: string;
}

@Entity()
export class SoloGameTreatment extends BaseLiteGameTreatment {
  @Column({ default: "freeplay" })
  gameType!: SoloGameType;

  @Column({
    type: "enum",
    enum: ["unknown", "range", "known"],
  })
  thresholdInformation!: ThresholdInformation;
}