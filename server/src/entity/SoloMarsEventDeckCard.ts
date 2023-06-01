import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class SoloPlayer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  deckId!: string;

  @Column()
  soloGameRoundId!: string;
  
  @Column()
  cardId!: string;

  @CreateDateColumn()
  dateCreated!: Date;
}