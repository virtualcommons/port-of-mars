import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { SoloGame } from "./LiteGame";
// import { LiteGame } from "./LiteGame";
import { SoloPlayerDecision } from "./LitePlayerDecision";
// import { LitePlayerDecision } from "./LitePlayerDecision";
import { SoloMarsEventDeckCard } from "./LiteMarsEventDeckCard";
// import { LiteMarsEventDeckCard } from "./LiteMarsEventDeckCard";

export abstract class BaseLiteGameRound {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  roundNumber!: number;

  @Column()
  initialSystemHealth!: number;

  @Column()
  initialPoints!: number;
}

@Entity()
export class SoloGameRound extends BaseLiteGameRound {
  @Column()
  gameId!: number;

  @ManyToOne(() => SoloGame, game => game.rounds)
  @JoinColumn({ name: "gameId" })
  game!: SoloGame;

  @OneToMany(() => SoloMarsEventDeckCard, card => card.round)
  cards!: SoloMarsEventDeckCard[];

  @OneToOne(() => SoloPlayerDecision, { nullable: false })
  @JoinColumn()
  decision!: SoloPlayerDecision;
}

// @Entity()
// export class LiteGameRound extends BaseLiteGameRound {
//   @Column()
//   gameId!: number;

//   @ManyToOne(() => LiteGame, game => game.rounds)
//   @JoinColumn({ name: "gameId" })
//   game!: LiteGame;

//   @OneToMany(() => LiteMarsEventDeckCard, card => card.round)
//   cards!: LiteMarsEventDeckCard[];

//   @OneToMany(() => LitePlayerDecision, decision => decision.round)
//   decisions!: LitePlayerDecision[];
// }
