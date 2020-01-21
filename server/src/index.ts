import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import http, { createServer } from "http";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { Server } from "colyseus";
import {GameRoom} from "@/game/room";
import {WaitingRoom} from "@/waitingLobby/room";
import { QuizRoom } from "@/quiz/room";

import * as path from "path";

const NODE_ENV = process.env.NODE_ENV || 'development';

function createApp(connection: any) {
    const port = Number(process.env.PORT || 2567);
    const app = express();

    if (NODE_ENV !== 'development') {
        app.use(helmet());
    } else {
        app.use(cors());
    }
    app.use(express.json());

    const server = http.createServer(app);
    const gameServer = new Server({
        server,
        express: app
    });

    // register your room handlers
    gameServer.define('game', GameRoom);
    gameServer.define('tutorial', GameRoom);
    gameServer.define('waiting',WaitingRoom);
    gameServer.define('quiz', QuizRoom);

    app.use(express.static('static'));

    gameServer.listen(port);
    console.log(`Listening on ws://localhost:${ port }`)
}

createConnection().then(async connection => {

    createApp(connection);

}).catch(error => console.log(error));
