import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "./Student";
import { Teacher } from "./Teacher";

@Entity()
export class Classroom {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => Student, student => student.classroom)
  students!: Student;

  @ManyToOne(type => Teacher, teacher => teacher.classrooms)
  teacher!: Teacher;

  @Column()
  teacherId!: number;

  @Column()
  authToken!: string;

  @Column()
  descriptor!: string;
}
