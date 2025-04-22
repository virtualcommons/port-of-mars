import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
// import { LiteGameRound } from "./LiteGameRound";
// import { LitePlayer } from "./LitePlayer";
// import { LiteMarsEventDeck } from "./LiteMarsEventDeck";

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

// @Entity()
// export class LitePlayerDecision extends BaseLitePlayerDecision {
//   @ManyToOne(() => LiteGameRound, round => round.decisions)
//   round!: LiteGameRound;

//   @ManyToOne(() => LitePlayer, player => player.decisions)
//   player!: LitePlayer;

//   @Column()
//   vote!: string;

//   @ManyToOne(() => LitePlayer, { nullable: true })
//   votedPlayer!: LitePlayer;

//   @ManyToOne(() => LiteMarsEventDeck, { nullable: true })
//   event!: LiteMarsEventDeck;
// }
