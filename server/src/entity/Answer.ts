import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {QuizQuestion} from "@/entity/QuizQuestion";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => QuizQuestion, quizQuestion => quizQuestion.answers, {nullable: false})
  @JoinColumn()
  quizQuestion!: QuizQuestion;

  @Column()
  quizQuestionId!: number;

  @Column()
  answer!: number;
}