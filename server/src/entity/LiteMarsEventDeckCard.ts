import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
} from "typeorm";
import { SoloMarsEventDeck, MultiplayerMarsEventDeck } from "./LiteMarsEventDeck";
import { SoloGameRound, MultiplayerGameRound } from "./LiteGameRound";
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

@Entity()
export class MultiplayerMarsEventDeckCard extends BaseLiteMarsEventDeckCard {
    @ManyToOne(() => MultiplayerMarsEventDeck, deck => deck.cards, { nullable: true })
    deck!: MultiplayerMarsEventDeck;
  
    @Column()
    deckId!: number;
  
    // @ManyToOne(() => MultiplayerMarsEventCard)
    // card!: MultiplayerMarsEventCard;
  
    @ManyToOne(() => MultiplayerGameRound, round => round.cards, { nullable: true })
    round!: MultiplayerGameRound;
}
  