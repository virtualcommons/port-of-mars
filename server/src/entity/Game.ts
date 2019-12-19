import {CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GameEvent} from "./GameEvent";
import {Tournament} from "@/entity/Tournament";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => GameEvent, event => event.game)
  events!: Array<GameEvent>;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(type => Tournament, tournament => tournament.games)
  tournament!: Tournament;
}