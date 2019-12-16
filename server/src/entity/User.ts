import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    constructor() {
        this.id = 1;
        this.firstName = 'Mars';
        this.lastName = 'Madness';
        this.age = 24;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
