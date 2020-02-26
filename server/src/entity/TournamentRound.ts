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
import { Game } from '@/entity/Game';
import { TournamentRoundInvite } from '@/entity/TournamentRoundInvite';
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

  @Column("text", { nullable: true })
  surveyURL!: string | null;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;
}
