import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { TournamentRound } from "./TournamentRound";
import { User } from "./User";
import { TournamentRoundDate } from "./TournamentRoundDate";

@Entity()
@Unique(["user", "tournamentRound"])
export class TournamentRoundInvite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tournamentRoundId!: number;

  @ManyToOne(type => TournamentRound, tournamentRound => tournamentRound.invitations)
  tournamentRound!: TournamentRound;

  @ManyToMany(type => TournamentRoundDate, tournamentRoundDate => tournamentRoundDate.signups)
  signupDates!: TournamentRoundDate[];

  @Column()
  userId!: number;

  @ManyToOne(type => User, user => user.invites)
  user!: User;

  @Column({ default: false })
  hasParticipated!: boolean;

  @Column({ default: false })
  hasCompletedIntroSurvey!: boolean;

  @Column({ default: false })
  hasCompletedExitSurvey!: boolean;

  @CreateDateColumn()
  dateCreated!: Date;
}
