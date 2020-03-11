import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "@/entity/Player";
import { TournamentRoundInvite } from "./TournamentRoundInvite";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @OneToMany(type => Player, player => player.user)
  players!: Array<Player>;

  @OneToMany(type => TournamentRoundInvite, invite => invite.user)
  invites!: Array<TournamentRoundInvite>

  @Column({ default: false })
  passedQuiz!: boolean;

  @Column()
  @Generated("uuid")
  registrationToken!: string;

  @Column()
  @Generated('uuid')
  participantId!: string;

  @Column({ default: false })
  isVerified!: boolean;
}



