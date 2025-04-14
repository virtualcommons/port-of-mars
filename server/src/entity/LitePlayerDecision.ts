import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { TrioGameRound } from "./LiteGameRound";
import { TrioPlayer } from "./LitePlayer";
import { TrioMarsEventDeck } from "./TrioMarsEventDeck";
  
export abstract class BaseLitePlayerDecision {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    systemHealthInvestment!: number;
  
    @Column()
    pointsInvestment!: number;
}
  
@Entity()
export class SoloPlayerDecision extends BaseLitePlayerDecision {}
  
@Entity()
export class TrioPlayerDecision extends BaseLitePlayerDecision {
    @ManyToOne(() => TrioGameRound, round => round.decisions)
    round!: TrioGameRound;
  
    @ManyToOne(() => TrioPlayer, player => player.decisions)
    player!: TrioPlayer;
  
    @Column()
    vote!: string;
  
    @ManyToOne(() => TrioPlayer, { nullable: true })
    votedPlayer!: TrioPlayer;
  
    @ManyToOne(() => TrioMarsEventDeck, { nullable: true })
    event!: TrioMarsEventDeck;
}
  