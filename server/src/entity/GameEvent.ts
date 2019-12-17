import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "./Game";

@Entity()
export class GameEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Game, game => game.events)
  game!: Game;

  @Column({type: 'jsonb'})
  payload!: object;

  @Column()
  dateCreated!: Date;
}