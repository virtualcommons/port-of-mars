import {CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GameEvent} from "./GameEvent";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => GameEvent, event => event.game)
  events!: Array<GameEvent>;

  @CreateDateColumn()
  dateCreated!: Date;
}