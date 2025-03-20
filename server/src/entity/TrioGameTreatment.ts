import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TrioGameType, ThresholdInformation } from "@port-of-mars/shared/triogame/types";

@Entity()
export class TrioGameTreatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "freeplay" })
  gameType!: TrioGameType;

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