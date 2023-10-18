import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { SoloMarsEventDeckCard } from "./SoloMarsEventDeckCard";

@Entity()
export class SoloMarsEventDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => SoloMarsEventDeckCard, card => card.deck, { nullable: true })
  @JoinColumn()
  cards!: SoloMarsEventDeckCard[];
}
