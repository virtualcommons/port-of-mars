import {EntityManager} from "typeorm";
import {AuthService} from "@port-of-mars/server/services/auth";
import {RegistrationService} from "@port-of-mars/server/services/registration";
import {AccountService} from "@port-of-mars/server/services/account";
import {TournamentService} from "@port-of-mars/server/services/tournament";
import {QuizService} from "@port-of-mars/server/services/quiz";
import {DashboardService} from "@port-of-mars/server/services/dashboard";
import {getConnection} from "@port-of-mars/server/util";
import {TimeService} from "@port-of-mars/server/services/time";
import {GameService} from "@port-of-mars/server/services/game";

export class ServiceProvider {
  constructor(public em: EntityManager) {}

  private  _auth?: AuthService;
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

  private _quiz?: QuizService;
  get quiz() {
    if (!this._quiz) {
      this._quiz = new QuizService(this);
    }
    return this._quiz;
  }

  private _registration?: RegistrationService;
  get registration() {
    if (!this._registration) {
      this._registration = new RegistrationService(this)
    }
    return this._registration;
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

  private _dashboard?: DashboardService;
  get dashboard(){
    if(!this._dashboard){
      this._dashboard = new DashboardService(this);
    }
    return this._dashboard;
  }
}

export function getServices(em?: EntityManager) {
  return new ServiceProvider(em ?? getConnection().manager);
}