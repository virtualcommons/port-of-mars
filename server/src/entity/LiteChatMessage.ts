import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LitePlayer } from "./LitePlayer";
import { LiteGame } from "./LiteGame";

@Entity()
export class LiteChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dateCreated!: Date;

  @ManyToOne(type => LitePlayer)
  player!: LitePlayer;

  @Column()
  playerId!: number;

  @Column()
  message!: string;

  @ManyToOne(type => LiteGame)
  game!: LiteGame;

  @Column()
  gameId!: number;

  @Column()
  round!: number;
}
