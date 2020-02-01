import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "./Game";

@Entity()
export class GameEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Game, game => game.events, { nullable: false })
  @JoinColumn()
  game!: Game;

  @Column()
  gameId!: number;

  @Column()
  type!: string;

  @Column({type: 'jsonb'})
  payload!: object;

  @Column()
  dateCreated!: Date;
}