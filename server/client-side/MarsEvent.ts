// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.8
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class MarsEvent extends Schema {
    @type("number") public id: number;
    @type("string") public name: string;
    @type("string") public flavorText: string;
    @type("string") public effect: string;

    constructor () {
        super();

        // initialization logic here.
    }

    onChange (changes: DataChange[]) {
        // onChange logic here.
    }

    onAdd () {
        // onAdd logic here.
    }

    onRemove () {
        // onRemove logic here.
    }

}
