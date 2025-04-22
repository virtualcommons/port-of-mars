import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
    OneToOne,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { SoloGameTreatment } from "./LiteGameTreatment";
import { MultiplayerGameTreatment } from "./LiteGameTreatment";
import { SoloMarsEventDeck } from "./LiteMarsEventDeck";
import { MultiplayerMarsEventDeck } from "./LiteMarsEventDeck";
import { SoloPlayer } from "./LitePlayer";
import { MultiplayerPlayer } from "./LitePlayer";
import { SoloGameRound } from "./LiteGameRound";
import { MultiplayerGameRound } from "./LiteGameRound";
import { SoloGameStatus, SoloGameType } from "@port-of-mars/shared/sologame";
import { MultiplayerGameStatus, MultiplayerGameType } from "@port-of-mars/shared/triogame";
  
export abstract class BaseLiteGame {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    dateCreated!: Date;
  
    @Column({ default: "freeplay" })
    type!: SoloGameType | MultiplayerGameType;
  
    @Column({
      type: "enum",
      enum: ["incomplete", "victory", "defeat"],
    })
    status!: SoloGameStatus | MultiplayerGameStatus;
  
    @Column({ default: 0 })
    maxRound!: number;
}
  
@Entity()
export class SoloGame extends BaseLiteGame {
    @OneToOne(() => SoloPlayer, player => player.game)
    @JoinColumn()
    player!: SoloPlayer;
  
    @Column()
    playerId!: number;
  
    @ManyToOne(() => SoloGameTreatment, { nullable: false })
    @JoinColumn()
    treatment!: SoloGameTreatment;
  
    @Column()
    treatmentId!: number;
  
    @OneToMany(() => SoloGameRound, round => round.game)
    rounds!: SoloGameRound[];
  
    @OneToOne(() => SoloMarsEventDeck, { nullable: false })
    @JoinColumn()
    deck!: SoloMarsEventDeck;
  
    @Column()
    deckId!: number;
  
    @Column()
    twoEventsThreshold!: number;
  
    @Column()
    threeEventsThreshold!: number;
}
  
@Entity()
export class MultiplayerGame extends BaseLiteGame {
    @OneToMany(() => MultiplayerPlayer, player => player.game)
    players!: MultiplayerPlayer[];
  
    @Column()
    treatmentIndex!: string;
  
    @Column()
    treatmentId!: number;
  
    @OneToMany(() => MultiplayerGameRound, round => round.game)
    rounds!: MultiplayerGameRound[];
  
    @ManyToOne(() => MultiplayerMarsEventDeck, { nullable: false })
    @JoinColumn()
    deck!: MultiplayerMarsEventDeck;
  
    @Column()
    deckId!: number;
  
    @Column()
    votingRoundsThreshold!: number;
}
  