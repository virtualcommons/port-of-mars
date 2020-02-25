import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Bracket} from "@/entity/Bracket";
import {User} from "@/entity/User";

@Entity()
export class BracketUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bracketId!: number;

  @ManyToOne(type => Bracket, bracket => bracket.bracketUsers)
  @JoinColumn()
  bracket!: Bracket;

  @Column()
  userId!: number;

  @ManyToOne(type => User)
  @JoinColumn()
  user!: User;
}
