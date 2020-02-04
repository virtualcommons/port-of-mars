import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "@/entity/User";
import {Quiz} from "./Quiz";

@Entity()
export class QuizSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, {nullable: false})
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(type => Quiz, {nullable: false})
  @JoinColumn()
  quiz!: Quiz;

  @Column()
  quizId!: number;
}