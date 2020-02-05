import {
  Check,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import {Quiz} from "@/entity/Quiz";
import {QuestionResponse} from "@/entity/QuestionResponse";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => Quiz, quiz => quiz.questions, {nullable: false})
  @JoinColumn()
  quiz!: Quiz;

  @Column()
  quizId!: number;

  @Column()
  question!: string;

  @Column({ type: "jsonb" })
  options!: Array<string>;

  @Column()
  correctAnswer!: number;

  @Column()
  tutorialElementId!: string;

  @Column()
  order!: number;

  @OneToMany(type => QuestionResponse, questionResponse => questionResponse.question)
  responses!: Array<QuestionResponse>;
}