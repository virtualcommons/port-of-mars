import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { TournamentRound } from "./TournamentRound";
import { TournamentRoundSignup } from "./TournamentRoundSignup";

@Entity()
export class TournamentRoundDate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tournamentRoundId!: number;

  @ManyToOne(type => TournamentRound, tournamentRound => tournamentRound.scheduledDates)
  tournamentRound!: TournamentRound;

  @OneToMany(type => TournamentRoundSignup, signup => signup.tournamentRoundDate)
  signups!: TournamentRoundSignup[];

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  date!: Date;
}
