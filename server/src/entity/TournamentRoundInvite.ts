import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from "typeorm";
import { TournamentRound } from "./TournamentRound";
import { User } from "./User";
import { TournamentRoundSignup } from "./TournamentRoundSignup";

@Entity()
@Unique(["user", "tournamentRound"])
export class TournamentRoundInvite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tournamentRoundId!: number;

  @ManyToOne(type => TournamentRound, tournamentRound => tournamentRound.invitations)
  tournamentRound!: TournamentRound;

  @OneToMany(type => TournamentRoundSignup, signup => signup.tournamentRoundInvite)
  signups!: TournamentRoundSignup[];

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
