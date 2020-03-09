import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Player} from "@/entity/Player";

@Entity()
@Unique(['username'])
@Unique(['email'])
@Unique(['registrationToken'])
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    username!: string;

    @Column({ nullable: true })
    email?: string;

    @OneToMany(type => Player, player => player.user)
    players!: Array<Player>;

    @Column({ default: false })
    passedQuiz!: boolean;

    @Column()
    @Generated("uuid")
    registrationToken!: string;

    @Column()
    @Generated('uuid')
    participantId!: string;

    @Column({ default: false })
    isVerified!: boolean;
}



