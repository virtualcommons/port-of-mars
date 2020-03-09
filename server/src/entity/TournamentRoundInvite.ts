import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { TournamentRound } from '@/entity/TournamentRound';
import { User } from '@/entity/User';

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

  @ManyToOne(type => User)
  user!: User;

  @Column()
  hasParticipated: boolean = false;

  @Column()
  hasCompletedIntroSurvey: boolean = false;

  @Column()
  hasCompletedExitSurvey: boolean = false;

  @CreateDateColumn()
  dateCreated!: Date;
}
