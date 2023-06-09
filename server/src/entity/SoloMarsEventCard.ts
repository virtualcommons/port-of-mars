import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinColumn} from "typeorm";
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

}