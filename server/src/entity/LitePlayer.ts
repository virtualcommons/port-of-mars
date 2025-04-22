import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    OneToOne,
    JoinColumn,
 } from "typeorm";
import { User } from "./User";
import { SoloGame } from "./LiteGame";
import { MultiplayerGame } from "./LiteGame";
  
export abstract class BaseLitePlayer {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(type => User, { nullable: false })
    user!: User;
  
    @Column()
    userId!: number;
  
    @Column({ default: "" })
    playerIp!: string;
  
    @Column("int", { nullable: true })
    points!: number | null;
  
    @CreateDateColumn()
    dateCreated!: Date;
}
  
@Entity()
export class SoloPlayer extends BaseLitePlayer {
    @OneToOne(type => SoloGame, game => game.player, { nullable: true })
    @JoinColumn()
    game!: SoloGame;
  
    @Column({ nullable: true })
    gameId!: number;
}
  
@Entity()
export class MultiplayerPlayer extends BaseLitePlayer {
    @ManyToOne(type => MultiplayerGame, game => game.players, { nullable: true })
    @JoinColumn()
    game!: MultiplayerGame;
  
    @Column({ nullable: true })
    gameId!: number;
}
  