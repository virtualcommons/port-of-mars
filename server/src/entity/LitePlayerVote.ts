import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LitePlayer } from "./LitePlayer";
import { LiteGameRound } from "./LiteGameRound";
import { LiteMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { Role, ROLES } from "@port-of-mars/shared/types";

@Entity()
export class LitePlayerVote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  binaryVote!: boolean;

  @Column({ type: "enum", enum: ROLES })
  roleVote!: Role;

  @ManyToOne(() => LitePlayer, p => p.votes, { nullable: false })
  player!: LitePlayer;

  @Column()
  playerId!: number;

  @ManyToOne(() => LiteGameRound, r => r.votes, { nullable: false })
  round!: LiteGameRound;

  @Column()
  roundId!: number;

  @ManyToOne(() => LiteMarsEventDeckCard, c => c.votes, { nullable: false })
  deckCard!: LiteMarsEventDeckCard;

  @Column()
  deckCardId!: number;
}
