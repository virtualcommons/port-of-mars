// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.8
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Accomplishment } from "./Accomplishment"

export class AccomplishmentSet extends Schema {
    @type([ Accomplishment ]) public boughtAccomplishment: ArraySchema<Accomplishment> = new ArraySchema<Accomplishment>();
    @type([ "number" ]) public purchasableAccomplishments: ArraySchema<number> = new ArraySchema<number>();

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
