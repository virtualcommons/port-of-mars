import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TournamentRound } from "./TournamentRound";
import { TournamentRoundInvite } from "./TournamentRoundInvite";

@Entity()
export class TournamentRoundDate {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tournamentRoundId!: number;

  @ManyToOne(type => TournamentRound, tournamentRound => tournamentRound.scheduledDates)
  tournamentRound!: TournamentRound;

  @ManyToMany(type => TournamentRoundInvite)
  @JoinTable()
  signups!: TournamentRoundInvite[];

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  date!: Date;
}
