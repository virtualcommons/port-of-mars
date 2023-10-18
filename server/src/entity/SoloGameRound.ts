import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { SoloPlayerDecision } from "./SoloPlayerDecision";
import { SoloMarsEventDeckCard } from "./SoloMarsEventDeckCard";

@Entity()
export class SoloGameRound {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @Column()
  gameId!: number;

  @Column()
  roundNumber!: number;

  @OneToMany(type => SoloMarsEventDeckCard, card => card.round)
  cards!: SoloMarsEventDeckCard[];

  @OneToOne(type => SoloPlayerDecision, { nullable: false })
  @JoinColumn()
  decision!: SoloPlayerDecision;
}
