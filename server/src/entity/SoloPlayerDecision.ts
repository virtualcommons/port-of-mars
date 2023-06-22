import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class SoloPlayerDecision {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  systemHealthInvestment!: number;

  @Column()
  pointsInvestment!: number;
}
