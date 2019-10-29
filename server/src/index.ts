import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "colyseus";
import {GameRoom} from "./Game";
import * as path from "path";

const port = Number(process.env.PORT || 2567);
const app = express()

app.use(cors());
app.use(express.json())

app.use('/', express.static(path.join(__dirname, 'static')))

const server = http.createServer(app);
const gameServer = new Server({
  server,
  express: app
});

// register your room handlers
gameServer.define('game', GameRoom);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
