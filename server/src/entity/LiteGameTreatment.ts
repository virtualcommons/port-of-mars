import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import {
    SoloGameType,
    ThresholdInformation as SoloThresholdInfo,
} from "@port-of-mars/shared/sologame/types";
import {
    TrioGameType,
    ThresholdInformation as TrioThresholdInfo,
} from "@port-of-mars/shared/triogame/types";
  
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
  thresholdInformation!: SoloThresholdInfo;
}

@Entity()
export class TrioGameTreatment extends BaseLiteGameTreatment {
  @Column({ default: "freeplay" })
  gameType!: TrioGameType;

  @Column({
    type: "enum",
    enum: ["unknown", "range", "known"],
  })
  thresholdInformation!: TrioThresholdInfo;
}