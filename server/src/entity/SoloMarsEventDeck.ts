import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { SoloMarsEventDeckCard } from "@port-of-mars/server/entity/SoloMarsEventDeckCard";

@Entity()
export class SoloPlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  codeName!: string;

  @OneToMany(type => SoloMarsEventDeckCard, game => game.player, { nullable: false })
  @JoinColumn()
  game!: SoloMarsEventDeckCard;
}
