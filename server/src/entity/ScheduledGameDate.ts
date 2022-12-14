import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class ScheduledGameDate {
  // this could potentially have a relationship with Game entity

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  minutesOpenBefore!: number;

  @Column()
  minutesOpenAfter!: number;

  @Column({
    generatedType: "STORED",
    asExpression: `"date" + interval '1 minute' * "minutesOpenAfter"`,
    nullable: true
  })
  lobbyCloseDate!: Date;

  @Column()
  autoCreated!: boolean;

  @CreateDateColumn()
  dateCreated!: Date;
}