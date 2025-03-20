import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { User } from "./User";
  import { TrioGame } from "./TrioGame";
  
  @Entity()
  export class TrioPlayer {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(type => User, user => user.trioPlayers, { nullable: false })
    user!: User;
  
    @Column()
    userId!: number;
  
    @Column({ default: "" })
    playerIp!: string;

    //multiple players can exist in one game
    @ManyToOne(type => TrioGame, game => game.players, { nullable: true })
    @JoinColumn()
    game!: TrioGame;
  
    @Column({ nullable: true })
    gameId!: number;
  
    @Column("int", { nullable: true })
    points!: number | null;
  
    @CreateDateColumn()
    dateCreated!: Date;
  }