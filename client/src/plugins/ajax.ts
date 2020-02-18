import Vue, {VueConstructor} from 'vue'
import _ from "lodash";
import {VueRouter} from "vue-router/types/router";
import {TStore} from "@/plugins/tstore";

declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxRequest;
  }
}

const LOGIN_CREDS = 'loginCreds';
const SUBMISSION_ID = 'submissionId';
const GAME_DATA = "gameData";

interface LoginCreds {
  token: string
  username: string
  passedQuiz: boolean
}

interface GameData {
  roomId: string;
  sessionId: string;
}

export class AjaxRequest {
  constructor(private router: VueRouter, private store: TStore) {}

  get loginCreds(): LoginCreds | null {
    const d = localStorage.getItem(LOGIN_CREDS);
    if (_.isNull(d)) {
      return null;
    }
    const data = JSON.parse(d!);
    if (!this.store.state.user.username) {
      this.store.commit('SET_USER', { username: data.username, passedQuiz: data.passedQuiz });
    }
    return data;
  }

  setLoginCreds(data: LoginCreds) {
    localStorage.setItem(LOGIN_CREDS, JSON.stringify(data));
    this.store.commit('SET_USER', { username: data.username, passedQuiz: data.passedQuiz });
  }

  setQuizCompletion(complete: boolean) {
    const loginCreds = this.loginCreds;
    if (!loginCreds) {
      throw new Error('loginCreds not found');
    }
    loginCreds.passedQuiz = complete;
    localStorage.setItem(LOGIN_CREDS, JSON.stringify(loginCreds));
    this.store.commit('SET_USER', { username: loginCreds.username, passedQuiz: loginCreds.passedQuiz });
  }

  forgetLoginCreds() {
    localStorage.removeItem(LOGIN_CREDS);
    this.store.commit('SET_USER', { username: '', passedQuiz: false });
  }

  get submissionId(): number | null {
    const d = localStorage.getItem(SUBMISSION_ID);
    if (_.isNull(d)) return null;
    const data = parseInt(d!);
    if (isNaN(data)) return null;
    return data;
  }

  setSubmissionId(data: number) {
    localStorage.setItem(SUBMISSION_ID, JSON.stringify(data));
  }

  forgetSubmissionId() {
    localStorage.removeItem(SUBMISSION_ID);
  }

  get gameData(): GameData | null {
    const d = localStorage.getItem(GAME_DATA);
    if (_.isNull(d)) return null;
    const data = JSON.parse(d!);
    return data;
  }

  setGameData(data: GameData) {
    localStorage.setItem(GAME_DATA, JSON.stringify(data));
  }

  forgetGameData() {
    localStorage.removeItem(GAME_DATA);
  }

  async post(path: string, data?: any) {
    const jwt = this.loginCreds?.token;
    if (!jwt) {
      throw new Error('must have jwt');
    }
    return await fetch(
      path,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
        redirect: 'follow',
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      }
    )
  }

  async postNoToken(path: string, data?: any) {
    return await fetch(
      path,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      }
    )
  }

  async get(path: string) {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };
    const jwt = this.loginCreds?.token;
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`
    }
    return await fetch(
      path,
      {
        method: 'GET',
        headers,
        redirect: 'follow',
        referrerPolicy: "no-referrer",
      }
    )
  }
}

export const Ajax = {
  install(instance: VueConstructor<Vue>, options: { router: VueRouter, store: TStore }) {
    instance.prototype.$ajax = new AjaxRequest(options.router, options.store);
  }
};
