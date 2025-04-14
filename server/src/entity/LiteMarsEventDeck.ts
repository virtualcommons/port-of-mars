import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { SoloMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { TrioMarsEventDeckCard } from "./LiteMarsEventDeckCard";
  
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

@Entity()
export class TrioMarsEventDeck extends BaseLiteMarsEventDeck {
    @OneToMany(() => TrioMarsEventDeckCard, card => card.deck, { nullable: true })
    @JoinColumn()
    cards!: TrioMarsEventDeckCard[];
}
  