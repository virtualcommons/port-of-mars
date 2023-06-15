import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SoloPlayerDecision {
  @PrimaryGeneratedColumn()
  id!: number;
}
