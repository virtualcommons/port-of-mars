import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseProlificStudy, ProlificSoloStudy, ProlificMultiplayerStudy } from "./ProlificStudy";
import { User } from "./User";
import { SoloGameTreatment } from "./LiteGameTreatment";
import { LitePlayer, SoloPlayer } from "./LitePlayer";

export abstract class BaseProlificStudyParticipant {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @Column()
  prolificId!: string;

  abstract study: BaseProlificStudy;

  @Column()
  studyId!: number;
}

@Entity()
export class ProlificSoloStudyParticipant extends BaseProlificStudyParticipant {
  @ManyToOne(type => ProlificSoloStudy, study => study.participants, { nullable: false })
  study!: ProlificSoloStudy;

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

@Entity()
export class ProlificMultiplayerStudyParticipant extends BaseProlificStudyParticipant {
  @ManyToOne(type => ProlificMultiplayerStudy, study => study.participants, { nullable: false })
  study!: ProlificMultiplayerStudy;

  @OneToOne(() => LitePlayer, { nullable: true })
  @JoinColumn()
  prolificBaselinePlayer!: LitePlayer;

  @Column({ nullable: true })
  prolificBaselinePlayerId!: number;

  @OneToOne(() => LitePlayer, { nullable: true })
  @JoinColumn()
  prolificVariablePlayer!: LitePlayer;

  @Column({ nullable: true })
  prolificVariablePlayerId!: number;
}
