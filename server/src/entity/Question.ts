import {Check, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Quiz} from "@/entity/Quiz";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  question!: string;

  @Column({ type: "jsonb" })
  options!: Array<string>;

  @Column({ type: "jsonb"})
  correct!: object | number;
}