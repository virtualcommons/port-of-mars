import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { LiteGameType } from "@port-of-mars/shared/lite";

export abstract class BaseLiteMarsEventCard {
  @PrimaryGeneratedColumn()
  id!: number;

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

@Entity()
export class SoloMarsEventCard extends BaseLiteMarsEventCard {
  @Column({ default: "freeplay" })
  gameType!: LiteGameType;
}
