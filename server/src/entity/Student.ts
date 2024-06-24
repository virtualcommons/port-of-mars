import { Column, JoinColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@port-of-mars/server/entity/User";
import { Classroom } from "./Classroom";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(type => User, { nullable: false })

  @ManyToOne(type => Classroom, classroom => classroom.students)
  classroom!: Classroom;

  @JoinColumn()
  user!: User;

  @Column()
  userId!: number;

  @Column()
  classroomId!: number;

  @Column({ unique: true })
  rejoinCode!: string;

  @Column({ default: false })
  isVerified!: boolean;
}
