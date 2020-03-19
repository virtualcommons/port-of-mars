import {EntityManager} from "typeorm";
import {AuthService} from "@port-of-mars/server/services/auth";
import {RegistrationService} from "@port-of-mars/server/services/registration";
import {AccountService} from "@port-of-mars/server/services/account";
import {TournamentService} from "@port-of-mars/server/services/tournament";
import {QuizService} from "@port-of-mars/server/services/quiz";
import {getConnection} from "@port-of-mars/server/util";

export class ServiceProvider {
  constructor(public em: EntityManager) {}

  private  _auth?: AuthService;
  get auth() {
    if (!this._auth) {
      this._auth = new AuthService(this.em);
    }
    return this._auth;
  }

  private _account?: AccountService;
  get account() {
    if (!this._account) {
      this._account = new AccountService(this.em);
    }
    return this._account;
  }

  private _quiz?: QuizService;
  get quiz() {
    if (!this._quiz) {
      this._quiz = new QuizService(this.em);
    }
    return this._quiz;
  }

  private _registration?: RegistrationService;
  get registration() {
    if (!this._registration) {
      this._registration = new RegistrationService(this.em)
    }
    return this._registration;
  }

  private _tournament?: TournamentService;
  get tournament() {
    if (!this._tournament) {
      this._tournament = new TournamentService(this.em);
    }
    return this._tournament;
  }
}

export function getServices() {
  return new ServiceProvider(getConnection().manager);
}