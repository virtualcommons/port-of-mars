import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";
import { QuizSubmission } from "./QuizSubmission";

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(type => Question, question => question.quiz)
  questions!: Array<Question>;

  @OneToMany(type => QuizSubmission, quizSubmission => quizSubmission.quiz)
  submissions!: Array<QuizSubmission>;
}
