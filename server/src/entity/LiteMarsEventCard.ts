import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from "typeorm";
import { SoloGameType } from "@port-of-mars/shared/sologame";
import { TrioGameType } from "@port-of-mars/shared/triogame";
  
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
    gameType!: SoloGameType;
}
  
@Entity()
export class TrioMarsEventCard extends BaseLiteMarsEventCard {
    @Column({ default: "freeplay" })
    gameType!: TrioGameType;
}
  