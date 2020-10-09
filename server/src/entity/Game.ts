import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, OneToOne } from "typeorm";
import { GameEvent } from "./GameEvent";
import { Player } from "@port-of-mars/server/entity/Player";
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

  @OneToMany(type => Player, player => player.game)
  players!: Array<Player>;

  @Column({ default: 'incomplete',  })
  status: 'incomplete' | 'defeat' | 'victory' | 'failure' = 'incomplete';

  @OneToOne(type => Player, { nullable: true })
  @JoinColumn()
  winner?: Player;
}
