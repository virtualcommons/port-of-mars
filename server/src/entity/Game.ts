import { GameType } from "@port-of-mars/shared/types";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { GameEvent } from "./GameEvent";
import { Player } from "./Player";
import { TournamentRound } from "./TournamentRound";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomId!: string;

  // git build-id
  @Column()
  buildId!: string;

  @OneToMany(type => GameEvent, event => event.game)
  events!: Array<GameEvent>;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column({ nullable: true })
  dateFinalized?: Date;

  @ManyToOne(type => TournamentRound, tournamentRound => tournamentRound.games)
  tournamentRound!: TournamentRound;

  @Column()
  tournamentRoundId!: number;

  @Column({ default: "freeplay" })
  type!: GameType;

  @OneToMany(type => Player, player => player.game)
  players!: Array<Player>;

  @Column({ default: "incomplete" })
  status: "incomplete" | "defeat" | "victory" | "failure" = "incomplete";

  @OneToOne(type => Player, { nullable: true })
  @JoinColumn()
  winner?: Player;
}
