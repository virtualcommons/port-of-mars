import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { SoloGameTreatment } from "./SoloGameTreatment";
import { SoloMarsEventDeck } from "./SoloMarsEventDeck";
import { SoloPlayer } from "./SoloPlayer";
import { SoloGameStatus } from "@port-of-mars/shared/sologame";

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

  @OneToOne(type => SoloMarsEventDeck, { nullable: false })
  @JoinColumn()
  deck!: SoloMarsEventDeck;

  @Column()
  deckId!: number;

  @Column({
    type: "enum",
    enum: ["incomplete", "victory", "defeat"],
  })
  status!: SoloGameStatus;

  @Column({ default: 0 })
  maxRound!: number;

  @Column()
  twoEventsThreshold!: number;

  @Column()
  threeEventsThreshold!: number;
}
