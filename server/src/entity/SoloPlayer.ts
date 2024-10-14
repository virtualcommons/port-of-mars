import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { SoloGame } from "./SoloGame";

@Entity()
export class SoloPlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.soloPlayers, { nullable: false })
  user!: User;

  @Column()
  userId!: number;

  @Column({ default: "" })
  playerIp!: string;

  @OneToOne(type => SoloGame, game => game.player, { nullable: true })
  @JoinColumn()
  game!: SoloGame;

  @Column({ nullable: true })
  gameId!: number;

  @Column("int", { nullable: true })
  points!: number | null;

  @CreateDateColumn()
  dateCreated!: Date;
}
