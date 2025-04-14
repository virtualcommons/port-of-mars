import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { SoloMarsEventDeck, TrioMarsEventDeck } from "./LiteMarsEventDeck";
import { SoloGameRound, TrioGameRound } from "./LiteGameRound";
import { SoloMarsEventCard } from "./LiteMarsEventCard";
import { TrioMarsEventCard } from "./LiteMarsEventCard";
  
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

@Entity()
export class TrioMarsEventDeckCard extends BaseLiteMarsEventDeckCard {
    @ManyToOne(() => TrioMarsEventDeck, deck => deck.cards, { nullable: true })
    deck!: TrioMarsEventDeck;
  
    @Column()
    deckId!: number;
  
    @ManyToOne(() => TrioMarsEventCard)
    card!: TrioMarsEventCard;
  
    @ManyToOne(() => TrioGameRound, round => round.cards, { nullable: true })
    round!: TrioGameRound;
}
  