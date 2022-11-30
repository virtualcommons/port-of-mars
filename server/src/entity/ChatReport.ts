import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn} from "typeorm";
import {Game} from "./Game";
import {User} from "./User";

@Entity()
export class ChatReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  dateCreated!: Date;

  @ManyToOne(type => Game)
  game!: Game;

  @Column()
  gameId!: number;

  @ManyToOne(type => User)
  user!: User;

  @Column()
  userId!: number;

  @Column({ type: 'jsonb' })
  message!: object;

  @Column({ default: false })
  resolved!: boolean;
}
