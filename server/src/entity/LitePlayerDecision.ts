import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { LitePlayer } from "./LitePlayer";
import { LiteGameRound } from "./LiteGameRound";

export abstract class BaseLitePlayerDecision {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  systemHealthInvestment!: number;

  @Column()
  pointsInvestment!: number;
}

@Entity()
export class SoloPlayerDecision extends BaseLitePlayerDecision {}

@Entity()
export class LitePlayerDecision extends BaseLitePlayerDecision {
  @ManyToOne(() => LiteGameRound, round => round.decisions, { nullable: true })
  round!: LiteGameRound;

  @Column()
  roundId!: number;

  @ManyToOne(() => LitePlayer, player => player.decisions, { nullable: true })
  player!: LitePlayer;

  @Column()
  playerId!: number;
}
