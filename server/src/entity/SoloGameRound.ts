import { Column, Entity, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn} from "typeorm";
import { User } from "./User";
import { SoloPlayerDecision } from "@port-of-mars/server/entity/SoloPlayerDecision";

@Entity()
export class SoloGameRound {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  gameId!: number;
  
  @CreateDateColumn()
  dateCreated!: Date;

  @OneToOne(type => SoloPlayerDecision, { nullable: false })
  @JoinColumn()
  decision!: SoloPlayerDecision;
}
