import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Role, ROLES} from "shared/types";
import {User} from "./User";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: ROLES ,
    })
    role!: Role;

    @ManyToOne(type => User, user => user.players)
    user!: User
}