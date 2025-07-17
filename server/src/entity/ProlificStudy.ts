import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {
  BaseProlificStudyParticipant,
  ProlificMultiplayerStudyParticipant,
  ProlificSoloStudyParticipant,
} from "./ProlificStudyParticipant";
import { LiteGameType } from "@port-of-mars/shared/lite/types";

export abstract class BaseProlificStudy {
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

  @Column({ default: "prolificBaseline" })
  gameType!: LiteGameType;

  abstract participants: Array<BaseProlificStudyParticipant>;
}

@Entity()
export class ProlificSoloStudy extends BaseProlificStudy {
  @OneToMany(type => ProlificSoloStudyParticipant, participant => participant.study)
  participants!: Array<ProlificSoloStudyParticipant>;
}

@Entity()
export class ProlificMultiplayerStudy extends BaseProlificStudy {
  @OneToMany(type => ProlificMultiplayerStudyParticipant, participant => participant.study)
  participants!: Array<ProlificMultiplayerStudyParticipant>;
}
