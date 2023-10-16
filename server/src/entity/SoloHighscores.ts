import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { SoloGame } from "@port-of-mars/server/entity/SoloGame";

@Entity()
export class SoloHighscores {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, { nullable: false })
  user!: User;

  @Column()
  userId!: number;

  @Column("float")
  pointsPerRound!: number;

  @Column()
  points!: number;

  @Column()
  maxRound!: number;

  @OneToOne(type => SoloGame, { nullable: true })
  game!: SoloGame;

  @Column({ nullable: true })
  gameId!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @UpdateDateColumn()
  lastModified!: Date;
}
