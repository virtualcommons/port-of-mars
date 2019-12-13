import { Room } from 'colyseus.js';


import {setupManager} from "@/main";
// import * as Colyseus from 'colyseus.js';
// import {

// } from 'shared/watiingLobby/types';

import { WaitingResponses } from 'shared/waitingLobby/responses';
import { Schema } from '@colyseus/schema';
import { TStore } from 'vue/types/vue';

type Schemify<T> = T & Schema;

async function switchRooms(){
    setupManager('game');
}

export function waitingApplyServerResponses<T>(room: Room, store: TStore){
    room.onMessage((msg: WaitingResponses) => {
        switch(msg.kind){
            case 'waiting-lobby' : console.log(msg.message); break;
            case 'switch-rooms' :console.log(msg.message); switchRooms(); break;
            default:break;
        }
    })
}