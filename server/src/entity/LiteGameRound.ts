import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    OneToMany,
    JoinColumn,
} from "typeorm";
import { SoloGame } from "./LiteGame";
import { MultiplayerGame } from "./LiteGame";
import { SoloPlayerDecision } from "./LitePlayerDecision";
import { MultiplayerPlayerDecision } from "./LitePlayerDecision";
import { SoloMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { MultiplayerMarsEventDeckCard } from "./LiteMarsEventDeckCard";
  
export abstract class BaseLiteGameRound {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    dateCreated!: Date;
  
    @Column()
    roundNumber!: number;
  
    @Column()
    initialSystemHealth!: number;
  
    @Column()
    initialPoints!: number;
}
  
@Entity()
export class SoloGameRound extends BaseLiteGameRound {
    @Column()
    gameId!: number;
  
    @ManyToOne(() => SoloGame, game => game.rounds)
    @JoinColumn({ name: "gameId" })
    game!: SoloGame;
  
    @OneToMany(() => SoloMarsEventDeckCard, card => card.round)
    cards!: SoloMarsEventDeckCard[];
  
    @OneToOne(() => SoloPlayerDecision, { nullable: false })
    @JoinColumn()
    decision!: SoloPlayerDecision;
}
  
@Entity()
export class MultiplayerGameRound extends BaseLiteGameRound {
    @Column()
    gameId!: number;
  
    @ManyToOne(() => MultiplayerGame, game => game.rounds)
    @JoinColumn({ name: "gameId" })
    game!: MultiplayerGame;
  
    @OneToMany(() => MultiplayerMarsEventDeckCard, card => card.round)
    cards!: MultiplayerMarsEventDeckCard[];
  
    @OneToMany(() => MultiplayerPlayerDecision, decision => decision.round)
    decisions!: MultiplayerPlayerDecision[];
}
  