import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";
import { SoloMarsEventDeckCard } from "./LiteMarsEventDeckCard";
// import { LiteMarsEventDeckCard } from "./LiteMarsEventDeckCard";

export abstract class BaseLiteMarsEventDeck {
  @PrimaryGeneratedColumn()
  id!: number;
}

@Entity()
export class SoloMarsEventDeck extends BaseLiteMarsEventDeck {
  @OneToMany(() => SoloMarsEventDeckCard, card => card.deck, { nullable: true })
  @JoinColumn()
  cards!: SoloMarsEventDeckCard[];
}

// @Entity()
// export class LiteMarsEventDeck extends BaseLiteMarsEventDeck {
//   @OneToMany(() => LiteMarsEventDeckCard, card => card.deck, { nullable: true })
//   @JoinColumn()
//   cards!: LiteMarsEventDeckCard[];
// }
