import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { SoloGame } from "./LiteGame";
import { LitePlayer } from "./LitePlayer";

export abstract class BaseLiteHighScore {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false })
  user!: User;

  @Column()
  userId!: number;

  @Column("float")
  pointsPerRound!: number;

  @Column()
  points!: number;

  @Column()
  maxRound!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @UpdateDateColumn()
  lastModified!: Date;
}

@Entity()
export class SoloHighScore extends BaseLiteHighScore {
  @OneToOne(type => SoloGame, { nullable: true })
  @JoinColumn()
  game!: SoloGame;

  @Column({ nullable: true })
  gameId!: number;
}

@Entity()
export class LiteHighScore extends BaseLiteHighScore {
  @ManyToOne(type => LitePlayer, { nullable: true })
  player!: LitePlayer;

  @Column({ nullable: true })
  playerId!: number;
}
