import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { SoloGameRound } from "@port-of-mars/server/entity/SoloGameRound";

export type ThresholdInformation = "unknown" | "range" | "known";
@Entity()
export class SoloGameTreatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name! : string;

  @Column()
  order! : number;

  @Column()
  isKnownNumberofRounds! : boolean;

  @Column()
  isEventDeckKnown! : boolean;
  
  @Column({
    type: "enum",
    enum: ["unknown", "range", "known"]
  })
  thresholdInformation! : ThresholdInformation;

   
}
