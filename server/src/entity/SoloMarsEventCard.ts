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

  @Column({ default: "" })
  displayName!: string;

  @Column({ default: "" })
  flavorText!: string;

  @Column()
  effect!: string;

  @Column({ default: 1 })
  drawMin!: number;

  @Column({ default: 1 })
  drawMax!: number;

  @Column({ default: 0 })
  rollMin!: number;

  @Column({ default: 0 })
  rollMax!: number;

  @Column({ default: 0 })
  systemHealthMultiplier!: number;

  @Column({ default: 0 })
  pointsMultiplier!: number;

  @Column({ default: 0 })
  resourcesMultiplier!: number;
}
