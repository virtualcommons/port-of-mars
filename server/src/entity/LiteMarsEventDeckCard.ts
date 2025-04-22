import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { SoloMarsEventDeck } from "./LiteMarsEventDeck";
import { SoloGameRound } from "./LiteGameRound";
import { SoloMarsEventCard } from "./LiteMarsEventCard";

export abstract class BaseLiteMarsEventDeckCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  cardId!: number;

  @Column()
  effectText!: string;

  @Column()
  systemHealthEffect!: number;

  @Column()
  resourcesEffect!: number;

  @Column()
  pointsEffect!: number;

  @Column({ nullable: true })
  roundId!: number;
}

@Entity()
export class SoloMarsEventDeckCard extends BaseLiteMarsEventDeckCard {
  @ManyToOne(() => SoloMarsEventDeck, deck => deck.cards, { nullable: true })
  deck!: SoloMarsEventDeck;

  @Column()
  deckId!: number;

  @ManyToOne(() => SoloMarsEventCard)
  card!: SoloMarsEventCard;

  @ManyToOne(() => SoloGameRound, round => round.cards, { nullable: true })
  round!: SoloGameRound;
}

// @Entity()
// export class LiteMarsEventDeckCard extends BaseLiteMarsEventDeckCard {
//   @ManyToOne(() => LiteMarsEventDeck, deck => deck.cards, { nullable: true })
//   deck!: LiteMarsEventDeck;

//   @Column()
//   deckId!: number;

//   // @ManyToOne(() => LiteMarsEventCard)
//   // card!: LiteMarsEventCard;

//   @ManyToOne(() => LiteGameRound, round => round.cards, { nullable: true })
//   round!: LiteGameRound;
// }
