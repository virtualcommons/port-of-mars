import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { SoloGame, LiteGame } from "./LiteGame";
import { Role, ROLES } from "@port-of-mars/shared/types";
import { LitePlayerDecision } from "./LitePlayerDecision";
import { LitePlayerVote } from "./LitePlayerVote";
import { LiteChatMessage } from "./LiteChatMessage";

export abstract class BaseLitePlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, { nullable: false })
  user!: User;

  @Column()
  userId!: number;

  @Column({ default: "" })
  playerIp!: string;

  @Column("int", { nullable: true })
  points!: number | null;

  @CreateDateColumn()
  dateCreated!: Date;
}

@Entity()
export class SoloPlayer extends BaseLitePlayer {
  @OneToOne(type => SoloGame, game => game.player, { nullable: true })
  @JoinColumn()
  game!: SoloGame;

  @Column({ nullable: true })
  gameId!: number;
}

@Entity()
export class LitePlayer extends BaseLitePlayer {
  @ManyToOne(type => LiteGame, game => game.players, { nullable: true })
  @JoinColumn()
  game!: LiteGame;

  @Column({ nullable: true })
  gameId!: number;

  @Column({
    type: "enum",
    enum: ROLES,
  })
  role!: Role;

  @OneToMany(() => LitePlayerDecision, decision => decision.player)
  decisions!: LitePlayerDecision[];

  @OneToMany(() => LitePlayerVote, vote => vote.player)
  votes!: LitePlayerVote[];

  @OneToMany(() => LiteChatMessage, message => message.player)
  chatMessages!: LiteChatMessage[];
}
