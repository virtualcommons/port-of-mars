import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { LiteGameType } from "@port-of-mars/shared/lite";
import { Role, ROLES } from "@port-of-mars/shared/types";

export abstract class BaseLiteMarsEventCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: "freeplay" })
  gameType!: LiteGameType;

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
export class SoloMarsEventCard extends BaseLiteMarsEventCard {}

@Entity()
export class LiteMarsEventCard extends BaseLiteMarsEventCard {
  @Column({
    type: "enum",
    enum: ROLES,
    nullable: true,
  })
  affectedRole?: Role;

  @Column({ default: false })
  requiresVote!: boolean;
}
