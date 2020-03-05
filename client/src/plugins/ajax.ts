import Vue, {VueConstructor} from 'vue'
import _ from "lodash";
import {VueRouter} from "vue-router/types/router";
import {TStore} from "@/plugins/tstore";
import {Page} from "shared/routes";

declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxRequest;
  }
}

const LOGIN_CREDS = 'loginCreds';
const SUBMISSION_ID = 'submissionId';
const GAME_DATA = "gameData";

interface LoginCreds {
  cookie: string
  username: string
}

interface GameData {
  roomId: string;
  sessionId: string;
}

export class AjaxRequest {
  constructor(private router: VueRouter, private store: TStore) {}

  async setLoginCreds(response: Response) {
    const data: LoginCreds = await response.json();
    if (process.env.NODE_ENV === 'development') {
      const cookie = data.cookie;
      if (!document.cookie.includes('jwt=')) {
        document.cookie = cookie;
      }
    }
    this.store.commit('SET_USER', { username: data.username });
  }

  get username(): string {
    return this.store.state.user.username;
  }

  setQuizCompletion(passedQuiz: boolean) {
    this.store.commit('SET_USER', { username: this.username, passedQuiz });
  }

  forgetLoginCreds() {
    document.cookie = "jwt= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
    return await fetch(
      path,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
