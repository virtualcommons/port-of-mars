import { Column, Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn} from "typeorm";
import { User } from "./User";
import { SoloMarsEventDeckCard } from "@port-of-mars/server/entity/SoloMarsEventDeckCard";

@Entity()
export class SoloMarsEventDeck {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  codeName!: string;

  @OneToMany(type => SoloMarsEventDeckCard, soloMarsEventDeck=>soloMarsEventDeck.soloMarsEventDeckCard { nullable: true })
  @JoinColumn()
  deckCard!: SoloMarsEventDeckCard;
}
