import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Question } from '@/entity/Question';
import { QuizSubmission } from '@/entity/QuizSubmission';

@Entity()
export class QuestionResponse {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Question, question => question.responses, {
    nullable: false
  })
  @JoinColumn()
  question!: Question;

  @Column()
  questionId!: number;

  @ManyToOne(
    type => QuizSubmission,
    quizSubmission => quizSubmission.responses,
    { nullable: false }
  )
  @JoinColumn()
  submission!: QuizSubmission;

  @Column()
  submissionId!: number;

  @Column()
  answer!: number;

  @CreateDateColumn()
  dateCreated!: Date;
}
