import {
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Treatment } from "./Treatment";
import { TournamentRound } from "./TournamentRound";

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(type => TournamentRound, round => round.tournament)
  rounds!: Array<TournamentRound>;

  @Column()
  active!: boolean;

  @Column({ default: 8 })
  minNumberOfGameRounds!: number;

  @Column({ default: 12 })
  maxNumberOfGameRounds!: number;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToMany(() => Treatment)
  @JoinTable()
  treatments!: Treatment[];
}
