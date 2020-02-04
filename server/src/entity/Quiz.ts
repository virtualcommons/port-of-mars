import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {QuizQuestion} from "@/entity/QuizQuestion";


@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(type => QuizQuestion, quizQuestion => quizQuestion.quiz)
  quizQuestions!: Array<QuizQuestion>;
}