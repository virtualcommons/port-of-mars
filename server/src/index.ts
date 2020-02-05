import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import http from "http";
import express, {Response} from "express";
import helmet from "helmet";
import cors from "cors";
import { Server } from "colyseus";
import {GameRoom} from "@/rooms/game";
import {WaitingRoom} from "@/rooms/waitingLobby";
import {mockGameInitOpts} from "@/util";
import {DBPersister} from "@/services/persistence";
import {ClockTimer} from "@gamestdio/timer/lib/ClockTimer";
import {login} from "@/routes/login";
import {quizRouter} from "@/routes/quiz";

const NODE_ENV = process.env.NODE_ENV || 'development';
const CONNECTION_NAME = NODE_ENV === 'test' ? 'test': 'default';

function createApp() {
    const port = Number(process.env.PORT || 2567);
    const app = express();

    if (NODE_ENV !== 'development') {
        app.use(helmet());
    } else {
        app.use(cors());
    }
    app.use(express.json());

    app.post('/login', login);
    
    // retrieve list of quiz q's from somewhere
    app.use(quizRouter);

    const server = http.createServer(app);
    const gameServer = new Server({
        server,
        express: app
    });

    const persister = new DBPersister();
    const clock = new ClockTimer();
    clock.setInterval(async () => persister.sync(), 5000);
    clock.start(true);
    gameServer.onShutdown(async () => {
        console.log('syncing events');
        await persister.sync();
        console.log('events synced');
    });

    // register your room handlers
    gameServer.define('game', GameRoom, mockGameInitOpts(persister));
    gameServer.define('waiting',WaitingRoom);

    app.use(express.static('static'));
    app.use((err: any, req: any, res: Response, next: any) => {
        res.status(err.statusCode || 500).json({ error: err.message });
    });

    gameServer.listen(port);
}

createConnection(CONNECTION_NAME).then(async connection => {

    createApp();

}).catch(error => console.error(error));
