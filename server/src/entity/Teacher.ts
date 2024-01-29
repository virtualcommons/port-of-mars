import { Column, JoinColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Classroom } from "./Classroom";
import { User } from "@port-of-mars/server/entity/User";

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, user => user, { nullable: false })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @OneToMany(type => Classroom, classroom => classroom.teacher)
  classrooms!: Classroom;
}
