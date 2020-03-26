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
import { GameRoom } from '@port-of-mars/server/rooms/game';
import { RankedLobbyRoom } from '@port-of-mars/server/rooms/lobby';
import { findUserById, getOrCreateUser } from '@port-of-mars/server/services/account';
import { User } from '@port-of-mars/server/entity/User';
import { DBPersister } from '@port-of-mars/server/services/persistence';
import { ClockTimer } from '@gamestdio/timer/lib/ClockTimer';
import { quizRouter } from '@port-of-mars/server/routes/quiz';
import * as fs from 'fs';
import { registrationRouter } from "@port-of-mars/server/routes/registration";
import { settings } from "@port-of-mars/server/settings";
import { isDev } from '@port-of-mars/shared/settings';

const logger = settings.logging.getLogger(__filename);
const NODE_ENV = process.env.NODE_ENV || 'development';
const CONNECTION_NAME = NODE_ENV === 'test' ? 'test' : 'default';

// FIXME: set up typescript types for these
const CasStrategy = require('passport-cas2').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const RedisStore = connectRedis(session);
const store = new RedisStore({ host: 'redis', client: redis.createClient({ host: 'redis' }) });
const sessionParser = session({
  resave: false,
  saveUninitialized: false,
  secret: settings.secret,
  store,
});

passport.use(new CasStrategy(
  {
    casURL: 'https://weblogin.asu.edu/cas'
  },
  // verify callback
  function (username: string, profile: object, done: Function) {
    getOrCreateUser(username).then(user => done(null, user));
  }
));
passport.use(new LocalStrategy(
  function (username: string, password: string, done: Function) {
    logger.warn('***** DO NOT ALLOW IN PRODUCTION! running local auth for user: ', username);
    getOrCreateUser(username).then(user => done(null, user));
  }
));

passport.serializeUser(function (user: User, done: Function) {
  logger.info('serializing user: ', user.id);
  done(null, user.id);
});

passport.deserializeUser(function (id: number, done: Function) {
  logger.warn(`deserializing ${id}`);
  findUserById(id)
    .then(user => done(null, user))
    .catch((e) => {
      logger.fatal(`Could not find user with ${id}: `, e);
      done(e, null);
    });
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
  applyInStagingOrProd(() => app.use(Sentry.Handlers.requestHandler()));
  if (isDev()) {
    logger.info('starting server up in dev mode');
    app.use(cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }));
  } else {
    app.use(helmet());
  }
  app.use(express.static('static'));
  app.use(express.json());
  app.use(cookieParser(settings.secret));
  app.use(sessionParser);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(function (req, res, next) {
    logger.info('req user: ', req.user);
    logger.info('req cookies: ', req.cookies);
    logger.info('req session: ', req.session);
    logger.info('req sessionID', req.sessionID);
    next();
  });

  // make this conditional on isDev()
  app.post('/login', passport.authenticate('local'), function (req, res) {
    const _sessionId = req.sessionID;
    logger.info(`successful authentication for ${req.user}, setting session id ${_sessionId}`);
    res.cookie('connect.sid', _sessionId, { signed: true });
    const sessionCookie: any = res.getHeaders()['set-cookie'];
    logger.info(sessionCookie);
    res.json({ username: (req.user as User).username, sessionCookie });
  });
  app.use('/quiz', quizRouter);
  app.use('/registration', registrationRouter);

  app.get('/asulogin',
    passport.authenticate('cas', { failureRedirect: '/' }),
    function (req, res) {
      // successful authentication
      if (req.user) {
        const username: string = (req.user as User).username;
        if (username?.length > 0) {
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

  /* may need to look into setting up a global error handler to deal with the possibility of 
  errors in deserializeUser
  https://stackoverflow.com/questions/41069593/how-do-i-handle-errors-in-passport-deserializeuser
  app.use(function (err, req, res, next) {
    if (err) {
      req.logout();
      if (req.originalUrl === '/') {
        next();
      }
      else {
        res.redirect('/');
      }
    }
    else {
      next();
    }
  });
  */

  const server = http.createServer(app);
  const gameServer = new Server({
    server,
    express: app,
    // put express session into websocket onAuth requests
    verifyClient(info, next) {
      sessionParser(info.req as any, {} as any, () => next(true))
    }
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
  gameServer.define(GameRoom.NAME, GameRoom);
  // FIXME: at some point we should refactor how we inject isDev() into the various classes that need them
  gameServer.define(RankedLobbyRoom.NAME, RankedLobbyRoom, { dev: isDev(), persister });


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
