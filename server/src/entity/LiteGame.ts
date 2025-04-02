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
  import { SoloGameTreatment } from "./SoloGameTreatment";
  import { TrioGameTreatment } from "./TrioGameTreatment";
  import { SoloMarsEventDeck } from "./SoloMarsEventDeck";
  import { TrioMarsEventDeck } from "./TrioMarsEventDeck";
  import { SoloPlayer } from "./SoloPlayer";
  import { TrioPlayer } from "./TrioPlayer";
  import { SoloGameRound } from "./SoloGameRound";
  import { TrioGameRound } from "./TrioGameRound";
  import { SoloGameStatus, SoloGameType } from "@port-of-mars/shared/sologame";
  import { TrioGameStatus, TrioGameType } from "@port-of-mars/shared/triogame";
  
  export abstract class BaseLiteGame {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    dateCreated!: Date;
  
    @Column({ default: "freeplay" })
    type!: SoloGameType | TrioGameType;
  
    @Column({
      type: "enum",
      enum: ["incomplete", "victory", "defeat"],
    })
    status!: SoloGameStatus | TrioGameStatus;
  
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
  export class TrioGame extends BaseLiteGame {
    @OneToMany(() => TrioPlayer, player => player.game)
    players!: TrioPlayer[];
  
    @ManyToOne(() => TrioGameTreatment, { nullable: false })
    @JoinColumn()
    treatment!: TrioGameTreatment;
  
    @Column()
    treatmentId!: number;
  
    @OneToMany(() => TrioGameRound, round => round.game)
    rounds!: TrioGameRound[];
  
    @ManyToOne(() => TrioMarsEventDeck, { nullable: false })
    @JoinColumn()
    deck!: TrioMarsEventDeck;
  
    @Column()
    deckId!: number;
  
    @Column()
    votingRoundsThreshold!: number;
  }
  