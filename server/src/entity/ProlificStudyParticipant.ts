import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProlificStudy } from "./ProlificStudy";
import { User } from "./User";
import { SoloGameTreatment } from "./SoloGameTreatment";
import { SoloPlayer } from "./SoloPlayer";

@Entity()
export class ProlificStudyParticipant {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @Column()
  prolificId!: string;

  @ManyToOne(type => ProlificStudy, study => study.participants, { nullable: false })
  study!: ProlificStudy;

  @Column()
  studyId!: number;

  @ManyToOne(type => SoloGameTreatment)
  prolificBaselineTreatment!: SoloGameTreatment;

  @Column()
  prolificBaselineTreatmentId!: number;

  @ManyToOne(type => SoloGameTreatment)
  prolificVariableTreatment!: SoloGameTreatment;

  @Column()
  prolificVariableTreatmentId!: number;

  @OneToOne(type => SoloPlayer, { nullable: true })
  @JoinColumn()
  prolificBaselinePlayer!: SoloPlayer;

  @Column({ nullable: true })
  prolificBaselinePlayerId!: number;

  @OneToOne(type => SoloPlayer, { nullable: true })
  @JoinColumn()
  prolificVariablePlayer!: SoloPlayer;

  @Column({ nullable: true })
  prolificVariablePlayerId!: number;
}
