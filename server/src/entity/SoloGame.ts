import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Role, ROLES } from "@port-of-mars/shared/types";
import { User } from "./User";
import { SoloGameTreatment } from "@port-of-mars/server/entity/SoloGameTreatment";

@Entity()
export class SoloPlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => SoloGameTreatment, game => game.player, { nullable: false })
  @JoinColumn()
  game!: SoloGameTreatment;

  @Column()
  SoloGameTreatmentId!: number;
  
  @CreateDateColumn()
  dateCreated!: Date;

  //FIXME: configuration parameters definition and type?
  @Column()
  configurationParameters!: number; 
}
