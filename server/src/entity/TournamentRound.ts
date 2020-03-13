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
import { Game } from '@port-of-mars/server/entity/Game';
import { TournamentRoundInvite } from '@port-of-mars/server/entity/TournamentRoundInvite';
import { Tournament } from './Tournament';

@Entity()
export class TournamentRound {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roundNumber!: number;

  @OneToMany(
    type => Game,
    game => game.tournamentRound
  )
  games!: Array<Game>;

  @ManyToOne(
    type => Tournament,
    tournament => tournament.rounds
  )
  tournament!: Tournament;

  @OneToMany(
    type => TournamentRoundInvite,
    invitation => invitation.tournamentRound
  )
  invitations!: Array<TournamentRoundInvite>;

  @Column({ nullable: true })
  introSurveyUrl?: string;

  @Column({ nullable: true })
  exitSurveyUrl?: string;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;
}
