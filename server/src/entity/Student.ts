import { Column, JoinColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@port-of-mars/server/entity/User";
import { Classroom } from "./Classroom";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, user => user.student, { nullable: false })
  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @ManyToOne(type => Classroom, classroom => classroom.students)
  classroom!: Classroom;

  @Column()
  classroomId!: number;
}
