import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "./Game";

@Entity()
export class GameEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Game, (game) => game.events, { nullable: false })
  game!: Game;

  @Column("string")
  type!: string;

  @Column({type: 'jsonb'})
  payload!: object;

  @Column("date")
  dateCreated!: Date;

  @Column("int")
  timeRemaining!: number;
}