import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { SoloGameRound } from "@port-of-mars/server/entity/SoloGameRound";

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
  
  @Column()
  thresholdInformation! : string;
  
  @ManyToOne(type => SoloGameRound, { nullable: false })
  @JoinColumn()
  round!: SoloGameRound;
  
}
