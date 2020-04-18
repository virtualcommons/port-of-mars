import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TournamentRound } from '@port-of-mars/server/entity/TournamentRound';
import { User } from '@port-of-mars/server/entity/User';

@Entity()
export class TournamentRoundInvite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tournamentRoundId!: number;

  @ManyToOne(
    type => TournamentRound,
    tournamentRound => tournamentRound.invitations
  )
  tournamentRound!: TournamentRound;

  @Column()
  userId!: number;

  @ManyToOne(type => User, user => user.invites)
  user!: User;

  @Column( { default: false })
  hasParticipated!: boolean;

  @Column( { default: false })
  hasCompletedIntroSurvey!: boolean;

  @Column( { default: false })
  hasCompletedExitSurvey!: boolean;

  @CreateDateColumn()
  dateCreated!: Date;
}
