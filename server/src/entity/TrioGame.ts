import {
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { TrioGameTreatment } from "./TrioGameTreatment";
  import { TrioMarsEventDeck } from "./TrioMarsEventDeck";
  import { TrioPlayer } from "./TrioPlayer";
  import { TrioGameRound } from "./TrioGameRound";
  import { TrioGameStatus, TrioGameType } from "@port-of-mars/shared/triogame";
  
  @Entity()
  export class TrioGame {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    dateCreated!: Date;
  
    //multiple players associated with one game
    @OneToMany(type => TrioPlayer, player => player.game)
    players!: TrioPlayer[];
  
    @ManyToOne(type => TrioGameTreatment, { nullable: false })
    @JoinColumn()
    treatment!: TrioGameTreatment;
  
    @Column()
    treatmentId!: number;
  
    @OneToMany(() => TrioGameRound, round => round.game)
    rounds!: TrioGameRound[];
  
    @ManyToOne(type => TrioMarsEventDeck, { nullable: false })
    @JoinColumn()
    deck!: TrioMarsEventDeck;
  
    @Column()
    deckId!: number;
  
    @Column({ default: "freeplay" })
    type!: TrioGameType;
  
    @Column({
      type: "enum",
      enum: ["incomplete", "victory", "defeat"],
    })
    status!: TrioGameStatus;
  
    @Column({ default: 0 })
    maxRound!: number;
  
    //defines how often voting occurs
    @Column()
    votingRoundsThreshold!: number;
  }