import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GameEvent } from "./GameEvent";
import { Player } from "@port-of-mars/server/entity/Player";
import { TournamentRound } from "./TournamentRound";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roomId!: string;

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

  @Column({ default: 'incomplete',  })
  status: 'incomplete' | 'defeat' | 'victory' = 'incomplete';
}
