import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import http from 'http';
import express, { Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as Sentry from '@sentry/node';
import { Server } from 'colyseus';
import { GameRoom } from '@/rooms/game';
import { RankedLobbyRoom } from '@/rooms/waitingLobby';
import { mockGameInitOpts } from '@/util';
import { DBPersister } from '@/services/persistence';
import { ClockTimer } from '@gamestdio/timer/lib/ClockTimer';
import {login, nextPage} from '@/routes/login';
import { quizRouter } from '@/routes/quiz';
import { issueRouter } from '@/routes/issue';
import * as fs from 'fs';
import {auth} from "@/routes/middleware";

const NODE_ENV = process.env.NODE_ENV || 'development';
const CONNECTION_NAME = NODE_ENV === 'test' ? 'test' : 'default';

function applyInStagingOrProd(f: Function) {
  if (['staging', 'production'].includes(NODE_ENV)) {
    f();
  }
}

applyInStagingOrProd(() =>
  Sentry.init({ dsn: fs.readFileSync('/run/secrets/sentry_dsn', 'utf-8') })
);

async function createApp() {
  const port = Number(process.env.PORT || 2567);
  const app = express();

  applyInStagingOrProd(() => app.use(Sentry.Handlers.requestHandler()));
  if (NODE_ENV !== 'development') {
    app.use(helmet());
  } else {
    app.use(cors());
  }
  app.use(express.json());
  app.use(cookieParser());

  app.get('/next-page/:pageName', auth, nextPage);
  app.post('/login', login);
  app.use('/quiz', quizRouter);
  app.use('/issue', issueRouter);

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
  gameServer.define('game', GameRoom, await mockGameInitOpts(persister));
  gameServer.define('waiting', RankedLobbyRoom, { dev: true });

  app.use(express.static('static'));

  applyInStagingOrProd(() => app.use(Sentry.Handlers.errorHandler()));
  app.use((err: any, req: any, res: Response, next: any) => {
    res.status(err.statusCode || 500).json({ error: err.message });
  });

  gameServer.listen(port);
}

createConnection(CONNECTION_NAME)
  .then(async connection => {
    await createApp();
  })
  .catch(error => console.error(error));
