import { Column, Entity, OneToOne, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from "typeorm";
import { SoloGameTreatment } from "@port-of-mars/server/entity/SoloGameTreatment";
import { SoloMarsEventDeck } from "./SoloMarsEventDeck";

@Entity()
export class SoloGame{
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => SoloGameTreatment, { nullable: false })
  @JoinColumn()
  treatment!: SoloGameTreatment;

  @Column()
  treatmentId!: number;
  
  @CreateDateColumn()
  dateCreated!: Date;

  @OneToOne(type => SoloMarsEventDeck, { nullable: false })
  @JoinColumn()
  deck!: SoloMarsEventDeck;

  @Column()
  deckId!: number;

 
}
