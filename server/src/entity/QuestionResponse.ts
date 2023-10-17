import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";
import { QuizSubmission } from "./QuizSubmission";

@Entity()
export class QuestionResponse {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Question, question => question.responses, { nullable: false })
  question!: Question;

  @Column()
  questionId!: number;

  @ManyToOne(type => QuizSubmission, quizSubmission => quizSubmission.responses, {
    nullable: false,
  })
  submission!: QuizSubmission;

  @Column()
  submissionId!: number;

  @Column()
  answer!: number;

  @CreateDateColumn()
  dateCreated!: Date;
}
