import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { TournamentRound } from './TournamentRound';

@Entity()
export class TournamentRoundDate {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    type => TournamentRound,
    tournamentRound => tournamentRound.scheduledDates
  )
  tournamentRound!: TournamentRound;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  date!: Date;
}
