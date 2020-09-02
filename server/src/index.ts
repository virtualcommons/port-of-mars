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
import {GameRoom, LoadTestGameRoom} from '@port-of-mars/server/rooms/game';
import { RankedLobbyRoom } from '@port-of-mars/server/rooms/lobby';
import { User } from '@port-of-mars/server/entity';
import { DBPersister } from '@port-of-mars/server/services/persistence';
import { ClockTimer } from '@gamestdio/timer/lib/ClockTimer';
import { quizRouter } from '@port-of-mars/server/routes/quiz';
import { dashboardRouter } from '@port-of-mars/server/routes/dashboard';
import { LOGIN_PAGE, CONSENT_PAGE, DASHBOARD_PAGE, getPagePath } from "@port-of-mars/shared/routes";

import * as fs from 'fs';
import { registrationRouter } from "@port-of-mars/server/routes/registration";
import { settings } from "@port-of-mars/server/settings";
import { isDev } from '@port-of-mars/shared/settings';
import { getServices } from "@port-of-mars/server/services";
import { gameRouter } from "@port-of-mars/server/routes/game";
import { surveyRouter } from "@port-of-mars/server/routes/survey";
import { ServerError } from './util';

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
  function (username: string, profile: Record<string, unknown>, done: Function) {
    getServices().account.getOrCreateUser(username, profile).then(user => done(null, user));
  }
));
passport.use(new LocalStrategy(
  function (username: string, password: string, done: Function) {
    logger.warn('***** DO NOT ALLOW IN PRODUCTION! running local auth for user: ', username);
    getServices().account.getOrCreateTestUser(username).then(user => {
      // set all testing things on the user
      done(null, user)
    });
  }
));

passport.serializeUser(function (user: User, done: Function) {
  logger.info('serializing user: ', user.id);
  done(null, user.id);
});

passport.deserializeUser(function (id: number, done: Function) {
  logger.warn(`deserializing ${id}`);
  getServices().account.findUserById(id)
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
  app.use('/survey', surveyRouter);
  app.use('/game', gameRouter);
  app.use('/quiz', quizRouter);
  app.use('/dashboard', dashboardRouter);
  app.use('/registration', registrationRouter);

  app.get('/asulogin',
    passport.authenticate('cas', { failureRedirect: '/' }),
    function (req, res) {
      // successful authentication
      if (req.user) {
        const user = (req.user as User)
        if (getServices().account.isRegisteredAndValid(user)) {
          res.redirect(getPagePath(DASHBOARD_PAGE));
        }
        else {
          logger.warn('invalid / unregistered user %o', user);
          res.redirect(getPagePath(CONSENT_PAGE));
        }
      } else {
        const loginPath = getPagePath(LOGIN_PAGE);
        logger.warn('no user on the request, returning to login %o', req);
        res.redirect(loginPath)
      }
    }
  );

  const server = http.createServer(app);
  const gameServer = new Server({
    server,
    express: app,
    // put express session into websocket onAuth requests
    verifyClient(info, next) {
      sessionParser(info.req as any, {} as any, () => next(true))
    }
  });

  // register your room handlers
  gameServer.define(GameRoom.NAME, GameRoom);
  gameServer.define('loadtest-game', LoadTestGameRoom);
  gameServer.define(RankedLobbyRoom.NAME, RankedLobbyRoom);


  applyInStagingOrProd(() => app.use(Sentry.Handlers.errorHandler()));
  // Final error handling middleware
  app.use((err: any, req: any, res: Response, next: any) => {
    if (err instanceof ServerError) {
      logger.warn(err);
      res.status(err.code).json(err.toDashboardMessage());
    }
    else {
      logger.fatal(err);
      res.status(err.statusCode || 500).json(err.toDashboardMessage());
    }
  });

  gameServer.listen(port);
}

createConnection(CONNECTION_NAME)
  .then(async connection => {
    await createApp();
  })
  .catch(error => console.error(error));
