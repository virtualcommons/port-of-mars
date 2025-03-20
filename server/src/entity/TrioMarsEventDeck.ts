import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { TrioMarsEventDeckCard } from "./TrioMarsEventDeckCard";

@Entity()
export class TrioMarsEventDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => TrioMarsEventDeckCard, card => card.deck, { nullable: true })
  @JoinColumn()
  cards!: TrioMarsEventDeckCard[];
}