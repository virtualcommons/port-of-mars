import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Expose } from "class-transformer";
import { ChatReport } from "./ChatReport";
import { User } from "./User";

type ActionType = "mute" | "ban";

@Entity()
export class Incident {
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

  @Column({ type: "enum", enum: ["mute", "ban"], default: "mute" })
  action!: ActionType;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column({ nullable: true })
  muteLength!: number; // length in days

  @Column({
    generatedType: "STORED",
    asExpression: `case when "muteLength" is not null then "dateCreated" + interval '1 day' * "muteLength" else null end`,
    nullable: true
  })
  dateExpires!: Date;

  @Column({ default: false })
  revoked!: boolean;
}