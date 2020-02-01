import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Role, ROLES} from "shared/types";
import {User} from "./User";
import {Game} from "@/entity/Game";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: ROLES ,
    })
    role!: Role;

    @ManyToOne(type => User, user => user.players, { nullable: false })
    @JoinColumn()
    user!: User;

    @Column()
    userId!: number;

    @ManyToOne(type => Game, game => game.players, { nullable: false })
    @JoinColumn()
    game!: Game;

    @Column()
    gameId!: number;
}