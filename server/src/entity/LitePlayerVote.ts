import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { LitePlayer } from "./LitePlayer";
import { LiteMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { Role } from "@port-of-mars/shared/types";
import { LiteGameBinaryVoteInterpretation } from "@port-of-mars/shared/lite/types";

@Entity()
export class LitePlayerVote {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column({ nullable: true })
  binaryVote?: boolean;

  @Column({ nullable: true })
  roleVote?: Role;

  @Column({ nullable: true })
  binaryVoteInterpretation?: LiteGameBinaryVoteInterpretation;

  @Column({ default: 1 })
  voteStep!: number;

  @ManyToOne(() => LitePlayer, { nullable: false })
  player!: LitePlayer;

  @Column()
  playerId!: number;

  @ManyToOne(() => LiteMarsEventDeckCard, c => c.votes, { nullable: false })
  deckCard!: LiteMarsEventDeckCard;

  @Column()
  deckCardId!: number;
}
