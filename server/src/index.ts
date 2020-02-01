import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import http from "http";
import express, {Response} from "express";
import helmet from "helmet";
import cors from "cors";
import { Server } from "colyseus";
import {GameRoom} from "@/game/room";
import {WaitingRoom} from "@/waitingLobby/room";
import { QuizRoom } from "@/quiz/room";
import {User} from "@/entity/User";
import jwt from 'jsonwebtoken';
import {mockGameInitOpts} from "@/util";
import {DBPersistenceAPI} from "@/repositories/Game";
import Clock from "@gamestdio/clock";
import {ClockTimer} from "@gamestdio/timer/lib/ClockTimer";

const NODE_ENV = process.env.NODE_ENV || 'development';

function createApp(connection: Connection) {
    const userRepo = connection.getRepository(User);

    const port = Number(process.env.PORT || 2567);
    const app = express();

    if (NODE_ENV !== 'development') {
        app.use(helmet());
    } else {
        app.use(cors());
    }
    app.use(express.json());

    app.post('/login', async (req, res, next) => {
        let user = await userRepo.findOne({ username: req.body.username });
        if (user) {
            res.json({ 
                token: jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h'}),
                username: user.username
            });
        } else {
            res.status(403).json(`user account with username ${req.body.username} not found`);
        }
    });

    // app.listen(port);
    const server = http.createServer(app);
    const gameServer = new Server({
        server,
        express: app
    });

    const persister = new DBPersistenceAPI(connection);
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
    gameServer.define('quiz', QuizRoom);

    app.use(express.static('static'));
    app.use((err: any, req: any, res: Response, next: any) => {
        res.status(err.statusCode || 500).json({ error: err.message });
    });

    gameServer.listen(port);
}

createConnection().then(async connection => {

    createApp(connection);

}).catch(error => console.log(error));
