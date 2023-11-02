import {
  OneToMany,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Game } from "./Game";
import { Tournament } from "./Tournament";

@Entity()
export class Treatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToMany(() => Tournament, tournament => tournament.treatments)
  tournaments!: Array<Tournament>;

  @Column("jsonb", { nullable: true })
  marsEventOverrides!: {
    eventId: string;
    quantity: number;
  }[];

  @OneToMany(type => Game, game => game.treatment, { nullable: true })
  games!: Array<Game>;
}
