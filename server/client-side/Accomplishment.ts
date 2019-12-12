// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.8
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";


export class Accomplishment extends Schema {
    @type("number") public id: number;
    @type("string") public role: string;
    @type("string") public label: string;
    @type("string") public flavorText: string;
    @type("number") public science: number;
    @type("number") public government: number;
    @type("number") public legacy: number;
    @type("number") public finance: number;
    @type("number") public culture: number;
    @type("number") public upkeep: number;
    @type("number") public victoryPoints: number;
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
