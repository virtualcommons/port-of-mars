import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { LiteGameTreatment, SoloGameTreatment } from "./LiteGameTreatment";
import { LiteMarsEventDeck, SoloMarsEventDeck } from "./LiteMarsEventDeck";
import { LitePlayer, SoloPlayer } from "./LitePlayer";
import { LiteGameRound, SoloGameRound } from "./LiteGameRound";
import { LiteChatMessage } from "./LiteChatMessage";
import { LiteGameStatus, LiteGameType } from "@port-of-mars/shared/lite";

export abstract class BaseLiteGame {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column({ default: "freeplay" })
  type!: LiteGameType;

  @Column({
    type: "enum",
    enum: ["incomplete", "victory", "defeat"],
  })
  status!: LiteGameStatus;

  @Column({ default: 0 })
  maxRound!: number;
}

@Entity()
export class SoloGame extends BaseLiteGame {
  @OneToOne(() => SoloPlayer, player => player.game)
  @JoinColumn()
  player!: SoloPlayer;

  @Column()
  playerId!: number;

  @ManyToOne(() => SoloGameTreatment, { nullable: false })
  @JoinColumn()
  treatment!: SoloGameTreatment;

  @Column()
  treatmentId!: number;

  @OneToMany(() => SoloGameRound, round => round.game)
  rounds!: SoloGameRound[];

  @OneToOne(() => SoloMarsEventDeck, { nullable: false })
  @JoinColumn()
  deck!: SoloMarsEventDeck;

  @Column()
  deckId!: number;

  @Column()
  twoEventsThreshold!: number;

  @Column()
  threeEventsThreshold!: number;
}

@Entity()
export class LiteGame extends BaseLiteGame {
  @OneToMany(() => LitePlayer, player => player.game)
  players!: LitePlayer[];

  @ManyToOne(() => LiteGameTreatment, { nullable: false })
  @JoinColumn()
  treatment!: LiteGameTreatment;

  @Column()
  treatmentId!: number;

  @OneToMany(() => LiteGameRound, round => round.game)
  rounds!: LiteGameRound[];

  @OneToMany(() => LiteChatMessage, message => message.game)
  chatMessages!: LiteChatMessage[];

  @OneToOne(() => LiteMarsEventDeck, { nullable: false })
  @JoinColumn()
  deck!: LiteMarsEventDeck;

  @Column()
  deckId!: number;

  @Column()
  twoEventsThreshold!: number;

  @Column()
  threeEventsThreshold!: number;
}
