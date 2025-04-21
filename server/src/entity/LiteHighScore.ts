import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User";
import { SoloPlayer } from "./LitePlayer";
  
export abstract class BaseLiteHighScore {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @ManyToOne(() => User, { nullable: false })
    user!: User;
  
    @Column()
    userId!: number;
  
    @Column("float")
    pointsPerRound!: number;
  
    @Column()
    points!: number;
  
    @Column()
    maxRound!: number;
  
    @CreateDateColumn()
    dateCreated!: Date;
  
    @UpdateDateColumn()
    lastModified!: Date;
}
  
@Entity()
export class SoloHighScore extends BaseLiteHighScore {
    @OneToOne(() => SoloPlayer, { nullable: true })
    @JoinColumn()
    player!: SoloPlayer;
  
    @Column({ nullable: true })
    gameId!: number;
}
  