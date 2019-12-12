// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.8
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from "@colyseus/schema";
import { Player } from "./Player"
import { ChatMessage } from "./ChatMessage"
import { MarsEvent } from "./MarsEvent"

export class GameState extends Schema {
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type("number") public timeRemaining: number;
    @type("number") public round: number;
    @type("number") public phase: number;
    @type("number") public upkeep: number;
    @type([ ChatMessage ]) public messages: ArraySchema<ChatMessage> = new ArraySchema<ChatMessage>();
    @type([ MarsEvent ]) public marsEvents: ArraySchema<MarsEvent> = new ArraySchema<MarsEvent>();
    @type("number") public marsEventsProcessed: number;

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
