import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn, Unique
} from 'typeorm';
import { TournamentRound } from './TournamentRound';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(
    type => TournamentRound,
    round => round.tournament
  )
  rounds!: Array<TournamentRound>;

  @Column()
  active!: boolean;

  /* FIXME: to be applied after pilot tournament concludes
  @Column()
  minNumberOfGameRounds!: number;

  @Column()
  maxNumberOfGameRounds!: number;
  */

  @CreateDateColumn()
  dateCreated!: Date;
}