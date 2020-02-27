import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GameEvent} from "./GameEvent";
import {Tournament} from "@/entity/Tournament";
import {Player} from "@/entity/Player";
import { TournamentRound } from "./TournamentRound";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => GameEvent, event => event.game)
  events!: Array<GameEvent>;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(type => TournamentRound, tournamentRound => tournamentRound.games)
  tournamentRound!: TournamentRound;

  @Column()
  tournamentRoundId!: number;

  @OneToMany(type => Player, player => player.game)
  players!: Array<Player>;
}