import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';
import { TournamentRound } from './TournamentRound';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(
    type => TournamentRound,
    round => round.tournament
  )
  rounds!: Array<TournamentRound>;

  @Column()
  active!: boolean;

  @CreateDateColumn()
  dateCreated!: Date;
}