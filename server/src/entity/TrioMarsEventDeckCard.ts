import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { TrioMarsEventDeck } from "./TrioMarsEventDeck";
import { TrioGameRound } from "./TrioGameRound";
import { TrioSoloMarsEventCard } from "./TrioMarsEventCard";

@Entity()
export class TrioMarsEventDeckCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(type => TrioMarsEventDeck, deck => deck.cards, { nullable: true })
  deck!: TrioMarsEventDeck;

  @Column()
  deckId!: number;

  @ManyToOne(type => TrioMarsEventCard)
  card!:TrioMarsEventCard;

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

  @ManyToOne(type => TrioGameRound, round => round.cards, { nullable: true })
  round!: TrioGameRound;

  @Column({ nullable: true })
  roundId!: number;
}
