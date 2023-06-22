import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SoloMarsEventCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  codeName!: string;

  @Column()
  displayName!: string;

  @Column()
  flavorText!: string;

  @Column()
  effect!: string;

  @Column()
  drawMin!: number;

  @Column()
  drawMax!: number;

  @Column()
  rollMin!: number;

  @Column()
  rollMax!: number;

  @Column()
  systemHealthMultiplier!: number;

  @Column()
  pointsMultiplier!: number;

  @Column()
  resourcesMultiplier!: number;
}
