import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SoloGameType } from "@port-of-mars/shared/sologame";

@Entity()
export class SoloMarsEventCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "freeplay" })
  gameType!: SoloGameType;

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
