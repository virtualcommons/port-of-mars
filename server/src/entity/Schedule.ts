import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;
}