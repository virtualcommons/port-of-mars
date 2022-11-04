import { createConnection } from "typeorm";
import http from "http";
import express, { Response } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectRedis from "connect-redis";
import * as Sentry from "@sentry/node";
import { Server } from "colyseus";

import { BUILD_ID, SENTRY_DSN, isDev } from "@port-of-mars/shared/settings";

// server side imports
import { GameRoom, LoadTestGameRoom } from "@port-of-mars/server/rooms/game";
import { RankedLobbyRoom } from "@port-of-mars/server/rooms/lobby";
import { User } from "@port-of-mars/server/entity";
import { settings } from "@port-of-mars/server/settings";
import { getRedis, getServices } from "@port-of-mars/server/services";
import {
  adminRouter,
  authRouter,
  dashboardRouter,
  gameRouter,
  quizRouter,
  registrationRouter,
  surveyRouter,
  statusRouter,
} from "@port-of-mars/server/routes";
import { ServerError, toUrl } from "./util";

const logger = settings.logging.getLogger(__filename);
const NODE_ENV = process.env.NODE_ENV || "development";
const CONNECTION_NAME = NODE_ENV === "test" ? "test" : "default";

// FIXME: make imports more consistent, replace `require` where possible

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const RedisStore = connectRedis(session);
const store = new RedisStore({ host: "redis", client: getRedis() });
const sessionParser = session({
  resave: false,
  saveUninitialized: false,
  secret: settings.secret,
  store,
});

passport.use(new GoogleStrategy({
    clientID: settings.googleAuth.clientId,
    clientSecret: settings.googleAuth.clientSecret,
    callbackURL: `${settings.serverHost}/auth/google/callback`,
    passReqToCallback: true
  },
  async function(request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
    const services = getServices();
    const user = await services.account.getOrCreateUser(profile.id, profile.emails[0].value);
    // const user = await s.account.getOrCreateUser()
    return done(null, user);
  }
));

passport.use(new FacebookStrategy({
    clientID: settings.facebookAuth.clientId,
    clientSecret: settings.facebookAuth.clientSecret,
    callbackURL: `${settings.serverHost}/auth/facebook/callback`,
    profileFields: ["id", "email"],
    passReqToCallback: true
  },
  async function(request:any, accessToken:any, refreshToken:any, profile:any, done:any) {
    const services = getServices();
    const user = await services.account.getOrCreateUser(profile.id, profile.emails[0].value);
    // const user = await s.account.getOrCreateUser()
    return done(null, user);
  }
));

passport.use(
  new LocalStrategy(async function (
    username: string,
    password: string,
    done: Function
  ) {
    const services = getServices();
    const user = await services.account.getOrCreateTestUser(username);
    // set all testing things on the user
    // const tournamentRound = await services.tournament.getCurrentTournamentRound();
    // const invite = await services.tournament.getOrCreateInvite(
    //   user.id,
    //   tournamentRound,
    //   true
    // );
    await done(null, user);
  })
);

passport.serializeUser(function (user: Pick<User, "id">, done: Function) {
  done(null, user.id);
} as any);

passport.deserializeUser(function (id: number, done: Function) {
  getServices()
    .account.findUserById(id)
    .then((user) => done(null, user))
    .catch((e) => {
      logger.fatal(`Could not find user with ${id}: `, e);
      done(e, null);
    });
});

function applyInStagingOrProd(f: () => void) {
  if (["staging", "production"].includes(NODE_ENV)) {
    f();
  }
}

applyInStagingOrProd(() => {
  Sentry.init({ dsn: SENTRY_DSN });
  logger.debug("Setting up sentry: %s", SENTRY_DSN);
});

async function createApp() {
  await (async () => {
    const sp = getServices();
    await sp.settings.loadIfNotExist();
  })();

  logger.info(
    "starting (%s) server: [build id: %s, settings.host %s]",
    process.env.NODE_ENV,
    BUILD_ID,
    settings.host
  );
  const port = Number(process.env.PORT || 2567);
  const app = express();
  applyInStagingOrProd(() => app.use(Sentry.Handlers.requestHandler()));
  if (isDev()) {
    logger.info("starting server up in dev mode");
    app.use(
      cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
  } else {
    logger.info("setting helmet content security policy");
    app.use(
      helmet.contentSecurityPolicy({
        useDefaults: false,
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", "sentry.comses.net"],
          frameSrc: ["'self'", "player.vimeo.com", "youtube.com", "https://www.youtube.com"],
          scriptSrc: ["'self'", "sentry.comses.net"],
          imgSrc: ["'self'", "data:"],
          styleSrc: ["'self'", "fonts.googleapis.com", "'unsafe-inline'"],
          fontSrc: ["'self'", "fonts.gstatic.com"],
          objectSrc: ["'none'"],
        },
      })
    );
  }
  app.use(express.static("static"));
  app.use(express.json());
  app.use(cookieParser(settings.secret));
  app.use(sessionParser);
  app.use(passport.initialize());
  app.use(passport.session());

  // make this conditional on isDev()
  app.post("/login", passport.authenticate("local"), function (req, res) {
    const _sessionId = req.sessionID;
    logger.info(
      `successful authentication for ${req.user}, setting session id ${_sessionId}`
    );
    res.cookie("connect.sid", _sessionId, { signed: true });
    const sessionCookie: any = res.getHeaders()["set-cookie"];
    logger.info(sessionCookie);
    res.json({ user: req.user, sessionCookie });
  });
  app.use("/admin", adminRouter);
  app.use("/auth", authRouter);
  app.use("/survey", surveyRouter);
  app.use("/game", gameRouter);
  app.use("/quiz", quizRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/registration", registrationRouter);
  app.use("/status", statusRouter);

  app.get("/logout", function (req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      return res.json({ user: {} });
    });
  });

  const server = http.createServer(app);
  const gameServer = new Server({
    server,
    // put express session into websocket onAuth requests
    verifyClient(info: any, next: any) {
      sessionParser(info.req as any, {} as any, () => next(true));
    },
  });

  // register your room handlers
  gameServer.define(GameRoom.NAME, GameRoom);
  gameServer.define("loadtest-game", LoadTestGameRoom);
  gameServer.define(RankedLobbyRoom.NAME, RankedLobbyRoom);

  applyInStagingOrProd(() => app.use(Sentry.Handlers.errorHandler()));
  // Final error handling middleware
  app.use((err: any, req: any, res: Response, next: any) => {
    if (err instanceof ServerError) {
      logger.warn(err);
      res.status(err.code).json(err.toDashboardMessage());
    } else {
      logger.fatal(err);
      res
        .status(err.statusCode || 500)
        .json({ kind: "danger", message: err.message });
    }
  });

  gameServer.listen(port);

  const services = getServices();
  if (await services.settings.isAutoSchedulerEnabled()) {
    // run scheduler once, then every hour if enabled
    await services.schedule.scheduleGames();
  }
  const schedule = require("node-schedule");
  const job = schedule.scheduleJob("0 * * * *", async () => {
    if (await services.settings.isAutoSchedulerEnabled()) {
      await services.schedule.scheduleGames();
    }
  });
}

createConnection(CONNECTION_NAME)
  .then(async (connection) => {
    await createApp();
  })
  .catch((error) => logger.fatal(error));
