import { EntityManager } from "typeorm";
import { AdminService } from "@port-of-mars/server/services/admin";
import { AuthService } from "@port-of-mars/server/services/auth";
import { AccountService } from "@port-of-mars/server/services/account";
import { TournamentService } from "@port-of-mars/server/services/tournament";
import { QuizService } from "@port-of-mars/server/services/quiz";
import { SurveyService } from "@port-of-mars/server/services/survey";
import { StatsService } from "@port-of-mars/server/services/stats";
import { TimeService } from "@port-of-mars/server/services/time";
import { GameService } from "@port-of-mars/server/services/game";
import { SoloGameService } from "@port-of-mars/server/services/sologame";
import { EducatorService } from "@port-of-mars/server/services/educator";
import { RedisSettings } from "@port-of-mars/server/services/settings";
import dataSource from "@port-of-mars/server/datasource";
import { createClient, RedisClient } from "redis";

export class ServiceProvider {
  constructor(public em: EntityManager) {}

  private _auth?: AuthService;
  get auth() {
    if (!this._auth) {
      this._auth = new AuthService(this);
    }
    return this._auth;
  }

  private _account?: AccountService;
  get account() {
    if (!this._account) {
      this._account = new AccountService(this);
    }
    return this._account;
  }

  private _game?: GameService;
  get game(): GameService {
    if (!this._game) {
      this._game = new GameService(this);
    }
    return this._game;
  }

  private _sologame?: SoloGameService;
  get sologame(): SoloGameService {
    if (!this._sologame) {
      this._sologame = new SoloGameService(this);
    }
    return this._sologame;
  }

  private _quiz?: QuizService;
  get quiz() {
    if (!this._quiz) {
      this._quiz = new QuizService(this);
    }
    return this._quiz;
  }

  private _time?: TimeService;
  get time() {
    if (!this._time) {
      this._time = new TimeService(this);
    }
    return this._time;
  }

  private _tournament?: TournamentService;
  get tournament() {
    if (!this._tournament) {
      this._tournament = new TournamentService(this);
    }
    return this._tournament;
  }

  private _survey?: SurveyService;
  get survey() {
    if (!this._survey) {
      this._survey = new SurveyService(this);
    }
    return this._survey;
  }

  private _leaderboard?: StatsService;
  get leaderboard() {
    if (!this._leaderboard) {
      this._leaderboard = new StatsService(this);
    }
    return this._leaderboard;
  }

  private _admin?: AdminService;
  get admin() {
    if (!this._admin) {
      this._admin = new AdminService(this);
    }
    return this._admin;
  }

  private _educator?: EducatorService;
  get educator() {
    if (!this._educator) {
      this._educator = new EducatorService(this);
    }
    return this._educator;
  }

  private _settings?: RedisSettings;
  get settings() {
    if (!this._settings) {
      this._settings = new RedisSettings(getRedis());
    }
    return this._settings;
  }
}

let _redis!: RedisClient;
export function getRedis(): RedisClient {
  if (!_redis) {
    _redis = createClient({ host: "redis" });
  }
  return _redis;
}

export function getServices(em?: EntityManager) {
  return new ServiceProvider(em ?? dataSource.manager);
}
