import {Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "@/entity/Game";

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => Game, game => game.tournament)
  games!: Array<Game>
}