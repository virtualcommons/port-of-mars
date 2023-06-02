import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinColumn} from "typeorm";
import { User } from "./User";
import { SoloMarsEventDeck } from "@port-of-mars/server/entity/SoloMarsEventDeck";

@Entity()
export class SoloMarsEventCard {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column()
  displayName!: string;
  
  @Column()
  codeName!: string;

  @ManyToMany(type => SoloMarsEventDeck, game => game.player, { nullable: false })
  @JoinColumn()
  game!: SoloMarsEventDeck;
}