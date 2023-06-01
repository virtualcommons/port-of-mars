import { Column, Entity, OneToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { SoloPlayerDecision } from "@port-of-mars/server/entity/SoloPlayerDecision";

@Entity()
export class SoloPlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  //FIXME: how to implement gameID?
  @Column()
  gameId!: number;
  
  @CreateDateColumn()
  dateCreated!: Date;

  @OneToOne(type => SoloPlayerDecision, game => game.player, { nullable: false })
  @JoinColumn()
  game!: SoloPlayerDecision;
}
