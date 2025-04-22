import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { SoloGameTreatment } from "./SoloGameTreatment";
import { SoloMarsEventDeck } from "./SoloMarsEventDeck";
import { SoloPlayer } from "./SoloPlayer";
import { SoloGameRound } from "./SoloGameRound";
import { LiteGameStatus, LiteGameType } from "@port-of-mars/shared/lite";

@Entity()
export class SoloGame {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @OneToOne(type => SoloPlayer, player => player.game)
  @JoinColumn()
  player!: SoloPlayer;

  @Column()
  playerId!: number;

  @ManyToOne(type => SoloGameTreatment, { nullable: false })
  @JoinColumn()
  treatment!: SoloGameTreatment;

  @Column()
  treatmentId!: number;

  @OneToMany(() => SoloGameRound, round => round.game)
  rounds!: SoloGameRound[];

  @OneToOne(type => SoloMarsEventDeck, { nullable: false })
  @JoinColumn()
  deck!: SoloMarsEventDeck;

  @Column()
  deckId!: number;

  @Column({ default: "freeplay" })
  type!: LiteGameType;

  @Column({
    type: "enum",
    enum: ["incomplete", "victory", "defeat"],
  })
  status!: LiteGameStatus;

  @Column({ default: 0 })
  maxRound!: number;

  @Column()
  twoEventsThreshold!: number;

  @Column()
  threeEventsThreshold!: number;
}
