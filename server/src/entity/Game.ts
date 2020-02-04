import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GameEvent} from "./GameEvent";
import {Tournament} from "@/entity/Tournament";
import {Player} from "@/entity/Player";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => GameEvent, event => event.game)
  events!: Array<GameEvent>;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(type => Tournament, tournament => tournament.games)
  @JoinColumn()
  tournament!: Tournament;

  @Column()
  tournamentId!: number;

  @OneToMany(type => Player, player => player.game)
  players!: Array<Player>;
}