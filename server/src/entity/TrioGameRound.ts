import {
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { TrioPlayerDecision } from "./TrioPlayerDecision";
  import { TrioMarsEventDeckCard } from "./TrioMarsEventDeckCard";
  import { TrioGame } from "./TrioGame";
  
  @Entity()
  export class TrioGameRound {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @CreateDateColumn()
    dateCreated!: Date;
  
    @Column()
    gameId!: number;
  
    @ManyToOne(type => TrioGame, game => game.rounds)
    @JoinColumn({ name: "gameId" })
    game!: TrioGame;
  
    @Column()
    roundNumber!: number;
  
    @OneToMany(type => TrioMarsEventDeckCard, card => card.round)
    cards!: TrioMarsEventDeckCard[];
  
    @Column()
    initialSystemHealth!: number;
  
    @Column()
    initialPoints!: number;
  
    //allows multiple players to make decisions each round (voting)
    @OneToMany(type => TrioPlayerDecision, decision => decision.round)
    decisions!: TrioPlayerDecision[];
  }