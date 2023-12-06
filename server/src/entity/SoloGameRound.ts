import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { SoloPlayerDecision } from "./SoloPlayerDecision";
import { SoloMarsEventDeckCard } from "./SoloMarsEventDeckCard";
import { SoloGame } from "./SoloGame";

@Entity()
export class SoloGameRound {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  gameId!: number;

  @ManyToOne(type => SoloGame, game => game.rounds)
  @JoinColumn({ name: "gameId" })
  game!: SoloGame;

  @Column()
  roundNumber!: number;

  @OneToMany(type => SoloMarsEventDeckCard, card => card.round)
  cards!: SoloMarsEventDeckCard[];

  // these are the initial values AFTER wear and tear
  @Column()
  initialSystemHealth!: number;

  @Column()
  initialPoints!: number;

  @OneToOne(type => SoloPlayerDecision, { nullable: false })
  @JoinColumn()
  decision!: SoloPlayerDecision;
}
