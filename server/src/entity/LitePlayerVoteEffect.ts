import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LiteMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { LitePlayer } from "./LitePlayer";

@Entity()
export class LitePlayerVoteEffect {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(() => LiteMarsEventDeckCard, { nullable: false })
  deckCard!: LiteMarsEventDeckCard;

  @Column()
  deckCardId!: number;

  @ManyToOne(() => LitePlayer, { nullable: false })
  player!: LitePlayer;

  @Column()
  playerId!: number;

  @Column({ default: 0 })
  pointsChange!: number;

  @Column({ default: 0 })
  resourcesChange!: number;

  @Column({ default: 0 })
  systemHealthChange!: number;
}
