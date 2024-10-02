import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProlificStudyParticipant } from "./ProlificStudyParticipant";

@Entity()
export class ProlificStudy {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  externalSurveyUrl?: string;

  @Column()
  studyId!: string;

  @Column()
  completionCode!: string;

  @OneToMany(type => ProlificStudyParticipant, participant => participant.study)
  participants!: Array<ProlificStudyParticipant>;
}
