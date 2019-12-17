import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Player} from "@/entity/Player";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @OneToMany(type => Player, player => player.user)
    players!: Array<Player>
}



