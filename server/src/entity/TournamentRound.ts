import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './Game';
import { Tournament } from './Tournament';
import { TournamentRoundDate } from './TournamentRoundDate';
import { TournamentRoundInvite } from './TournamentRoundInvite';

@Entity()
export class TournamentRound {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  roundNumber!: number;

  @Column({ default: 12})
  numberOfGameRounds!: number;

  @OneToMany(
    type => Game,
    game => game.tournamentRound
  )
  games!: Array<Game>;

  @Column()
  tournamentId!: number;

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

  @OneToMany(
    type => TournamentRoundDate,
    date => date.tournamentRound
  )
  scheduledDates!: Array<TournamentRoundDate>;
}