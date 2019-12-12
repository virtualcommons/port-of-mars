// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.8
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { ResourceCosts } from "./ResourceCosts"
import { AccomplishmentSet } from "./AccomplishmentSet"

export class Player extends Schema {
    @type("string") public role: string;
    @type(ResourceCosts) public costs: ResourceCosts = new ResourceCosts();
    @type(AccomplishmentSet) public accomplishment: AccomplishmentSet = new AccomplishmentSet();
    @type("boolean") public ready: boolean;

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

  buyAccomplishment(accomplishment: AccomplishmentData) {

  }
}
