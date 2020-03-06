import 'reflect-metadata';
import { createConnection } from 'typeorm';
import http from 'http';
import express, { Response } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import * as Sentry from '@sentry/node';
import { Server } from 'colyseus';
import { GameRoom } from '@/rooms/game';
import { RankedLobbyRoom } from '@/rooms/waitingLobby';
import { mockGameInitOpts } from '@/util';
import { JWT_SECRET, setJWTCookie } from '@/services/auth';
import {findOrCreateUser, findById, getOrCreateUser} from '@/services/account';
import { User } from '@/entity/User';
import { DBPersister } from '@/services/persistence';
import { ClockTimer } from '@gamestdio/timer/lib/ClockTimer';
import { login, nextPage } from '@/routes/login';
import { quizRouter } from '@/routes/quiz';
import * as fs from 'fs';
import { auth } from "@/routes/middleware";
import {registrationRouter} from "@/routes/registration";
import {settings} from "@/settings";

const logger = settings.logging.getLogger(__filename);
const NODE_ENV = process.env.NODE_ENV || 'development';
const CONNECTION_NAME = NODE_ENV === 'test' ? 'test' : 'default';

// FIXME: set up a typescript type for this
const CasStrategy = require('passport-cas2').Strategy;
const RedisStore = connectRedis(session);

passport.use(new CasStrategy(
  {
    casURL: 'https://weblogin.asu.edu/cas'
  },
  // verify callback
  async function (username: string, profile: object, done: Function) {

    const user = await getOrCreateUser(username);
    // FIXME: done should probably be threaded into the findOrCreateUser
    done(null, user);
  }
));

passport.serializeUser(function (user: User, done: Function) {
  done(null, user.id);
});

passport.deserializeUser(async function (id: number, done: Function) {
  logger.warn(`entered deserialize ${id}`);
  const user = await findById(id);
  done(null, user);
});

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
  const store = new RedisStore({ host: 'redis', client: redis.createClient({ host: 'redis' }) });

  applyInStagingOrProd(() => app.use(Sentry.Handlers.requestHandler()));
  if (NODE_ENV !== 'development') {
    app.use(helmet());
  } else {
    app.use(cors());
  }
  app.use(express.json());
  app.use(cookieParser(JWT_SECRET));
  app.use(session({ store: store, secret: JWT_SECRET, saveUninitialized: false, resave: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.post('/next-page/:pageName', auth, nextPage);
  app.post('/login', login);
  app.use('/quiz', quizRouter);
  app.use('/registration', passport.authenticate('local', { failureRedirect: '/'}), registrationRouter);

  app.get('/asulogin',
    passport.authenticate('cas', { failureRedirect: '/' }),
    function (req, res) {
      // successful authentication, set JWT token cookie and redirect to server nexus
      if (req.user) {
        const username: string = (req.user as User).username;
        if (username?.length > 0) {
          setJWTCookie(res, (req.user as any).username);
          res.redirect('/');
          return;
        }
        logger.warn('no username attached to', req);
        res.redirect('/');
      } else {
        logger.warn('no user attached to', req);
        res.redirect('/')
      }
    }
  );

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
    logger.info('syncing events');
    await persister.sync();
    logger.info('events synced');
  });

  // register your room handlers
  gameServer.define('game', GameRoom, await mockGameInitOpts(persister));
  gameServer.define('waiting', RankedLobbyRoom, { dev: true });

  app.use(express.static('static'));

  applyInStagingOrProd(() => app.use(Sentry.Handlers.errorHandler()));
  app.use((err: any, req: any, res: Response, next: any) => {
    res.status(err.statusCode || 500).json({ error: 'Unhandled server error' });
    logger.fatal(err);
  });

  gameServer.listen(port);
}

createConnection(CONNECTION_NAME)
  .then(async connection => {
    await createApp();
  })
  .catch(error => console.error(error));
