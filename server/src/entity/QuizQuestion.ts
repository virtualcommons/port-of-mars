import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Question} from "@/entity/Question";
import {Quiz} from "@/entity/Quiz";
import {Answer} from "@/entity/Answer";

@Entity()
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Question)
  @JoinColumn()
  question!: Question;

  @Column()
  questionId!: number;

  @ManyToOne(type => Quiz, quiz => quiz.quizQuestions, {nullable: false})
  @JoinColumn()
  quiz!: Quiz;

  @Column()
  quizId!: number;

  @Column()
  order!: number;

  @OneToMany(type => Answer, answer => answer.quizQuestion)
  answers!: Array<Answer>;
}