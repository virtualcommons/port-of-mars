import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { ChatReport } from "./ChatReport";
import { User } from "./User";
import { ModerationActionType, MODERATION_ACTION_TYPES } from "@port-of-mars/shared/types";

@Entity()
export class ModerationAction {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => ChatReport, { nullable: true })
  report!: ChatReport;

  @Column()
  reportId!: number;

  @ManyToOne(type => User, { nullable: false })
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(type => User, { nullable: false })
  admin!: User;

  @Column()
  adminId!: number;

  @Column({ type: "enum", enum: MODERATION_ACTION_TYPES })
  action!: ModerationActionType;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column({ nullable: true })
  daysMuted!: number;

  @Column({
    generatedType: "STORED",
    asExpression: `case when "daysMuted" is not null then "dateCreated" + interval '1 day' * "daysMuted" else null end`,
    nullable: true,
  })
  dateMuteExpires!: Date;

  @Column({ default: false })
  revoked!: boolean;
}
