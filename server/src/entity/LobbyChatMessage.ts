import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameType } from "@port-of-mars/shared/types";
import { User } from "./User";

@Entity()
export class LobbyChatMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dateCreated!: Date;

  @ManyToOne(type => User)
  user!: User;

  @Column()
  userId!: number;

  @Column()
  message!: string;

  @Column()
  roomId!: string;

  @Column()
  lobbyType!: GameType;
}
