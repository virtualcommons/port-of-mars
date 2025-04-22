import {
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { SoloMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { MultiplayerMarsEventDeckCard } from "./LiteMarsEventDeckCard";
  
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
export class MultiplayerMarsEventDeck extends BaseLiteMarsEventDeck {
    @OneToMany(() => MultiplayerMarsEventDeckCard, card => card.deck, { nullable: true })
    @JoinColumn()
    cards!: MultiplayerMarsEventDeckCard[];
}
  