import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "./Game";

@Entity()
export class GameEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Game, (game) => game.events, { nullable: false })
  game!: Game;

  @Column()
  type!: string;

  @Column({type: 'jsonb'})
  payload!: object;

  @Column()
  dateCreated!: Date;

  @Column()
  timeRemaining!: number;
}