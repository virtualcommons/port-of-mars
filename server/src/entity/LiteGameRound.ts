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
import { TrioGame } from "./LiteGame";
import { SoloPlayerDecision } from "./LitePlayerDecision";
import { TrioPlayerDecision } from "./LitePlayerDecision";
import { SoloMarsEventDeckCard } from "./LiteMarsEventDeckCard";
import { TrioMarsEventDeckCard } from "./LiteMarsEventDeckCard";
  
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
export class TrioGameRound extends BaseLiteGameRound {
    @Column()
    gameId!: number;
  
    @ManyToOne(() => TrioGame, game => game.rounds)
    @JoinColumn({ name: "gameId" })
    game!: TrioGame;
  
    @OneToMany(() => TrioMarsEventDeckCard, card => card.round)
    cards!: TrioMarsEventDeckCard[];
  
    @OneToMany(() => TrioPlayerDecision, decision => decision.round)
    decisions!: TrioPlayerDecision[];
}
  