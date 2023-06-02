import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { SoloGameTreatment } from "@port-of-mars/server/entity/SoloGameTreatment";

@Entity()
export class SoloGame{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => SoloGameTreatment, game => game.player, { nullable: false })
  @JoinColumn()
  game!: SoloGameTreatment;

  @Column()
  SoloGameTreatmentId!: number;
  
  @CreateDateColumn()
  dateCreated!: Date;
 
}
