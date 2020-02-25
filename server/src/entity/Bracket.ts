import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Game} from "@/entity/Game";
import {BracketUser} from "@/entity/BracketUser";

@Entity()
export class Bracket {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    gameId!: number;

    @ManyToOne(type => Game, game => game.id)
    @JoinColumn()
    game!: Game;

    @OneToMany(type => BracketUser, bracketUser => bracketUser.id)
    bracketUsers!: Array<BracketUser>;
}
