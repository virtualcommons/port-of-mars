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
import { JWT_SECRET, generateJWT, setJWTCookie } from '@/services/auth';
import { findByUsername, findUserById, getOrCreateUser } from '@/services/account';
import { User } from '@/entity/User';
import { DBPersister } from '@/services/persistence';
import { ClockTimer } from '@gamestdio/timer/lib/ClockTimer';
import { login, nextPage } from '@/routes/login';
import { quizRouter } from '@/routes/quiz';
import * as fs from 'fs';
import { auth } from "@/routes/middleware";
import { registrationRouter } from "@/routes/registration";
import { settings } from "@/settings";
import { isDev } from 'shared/settings';
import cookie from 'cookie';

const logger = settings.logging.getLogger(__filename);
const NODE_ENV = process.env.NODE_ENV || 'development';
const CONNECTION_NAME = NODE_ENV === 'test' ? 'test' : 'default';

// FIXME: set up typescript types for these
const CasStrategy = require('passport-cas2').Strategy;
const LocalStrategy = require('passport-local').Strategy;

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
// make this conditional on isDev()
passport.use(new LocalStrategy(
  async function (username: string, password: string, done: Function) {
    logger.info('trying to local auth for user: ', username);
    let user = await findByUsername(username);
    if (!user) {
      return done(null, false, { message: `No user ${username}.` });
    }
    return done(null, user);
  }
));

passport.serializeUser(function (user: User, done: Function) {
  logger.info('serializing user: ', user.id);
  done(null, user.id);
});

passport.deserializeUser(async function (id: number, done: Function) {
  logger.warn(`entered deserialize ${id}`);
  const user = await findUserById(id);
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
  if (isDev()) {
    logger.info('starting server up in dev mode');
    app.use(cors({
       origin: ['http://localhost:2567', 'http://localhost:8081', 'https://portofmars.asu.edu'],
       credentials: true
    }));
  } else {
    app.use(helmet());
  }
  app.use(express.static('static'));
  app.use(express.json());
  app.use(cookieParser(JWT_SECRET));
  app.use(session({ 
    store,
    secret: JWT_SECRET,
    saveUninitialized: false,
    resave: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function(req, res, next) {
    logger.info('req user: ', req.user);
    logger.info('req cookies: ', req.cookies);
    logger.info('req session: ', req.session);
    logger.info('req sessionID', req.sessionID);
    next();
  });

  // make this conditional on isDev()
  app.post('/login', passport.authenticate('local'), function(req, res) {
    const _sessionId = req.sessionID;
    logger.info(`successful authentication for ${req.user}, setting session id ${_sessionId}`);
    res.cookie('connect.sid', _sessionId, { signed: true });
    const sessionCookie = res.getHeaders()['set-cookie'];
    logger.info(sessionCookie);
    res.json({username: req.user.username, sessionCookie });
  });
  app.use('/quiz', quizRouter);
  app.use('/registration', registrationRouter);

  app.get('/asulogin',
    passport.authenticate('cas', { failureRedirect: '/' }),
    function (req, res) {
      // successful authentication, set JWT token cookie and redirect to server nexus
      if (req.user) {
        const username: string = (req.user as User).username;
        if (username?.length > 0) {
          setJWTCookie(res, username);
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
