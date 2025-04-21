import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { MultiplayerGameRound } from "./LiteGameRound";
import { MultiplayerPlayer } from "./LitePlayer";
import { MultiplayerMarsEventDeck } from "./MultiplayerMarsEventDeck";
  
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
export class MultiplayerPlayerDecision extends BaseLitePlayerDecision {
    @ManyToOne(() => MultiplayerGameRound, round => round.decisions)
    round!: MultiplayerGameRound;
  
    @ManyToOne(() => MultiplayerPlayer, player => player.decisions)
    player!: MultiplayerPlayer;
  
    @Column()
    vote!: string;
  
    @ManyToOne(() => MultiplayerPlayer, { nullable: true })
    votedPlayer!: MultiplayerPlayer;
  
    @ManyToOne(() => MultiplayerMarsEventDeck, { nullable: true })
    event!: MultiplayerMarsEventDeck;
}
  