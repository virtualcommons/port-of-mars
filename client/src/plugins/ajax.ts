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

interface LoginCreds {
  token: string
  username: string
  passedQuiz: boolean
}

export class AjaxRequest {
  constructor(private router: VueRouter, private store: TStore) {}

  get loginCreds(): LoginCreds | null {
    const d = localStorage.getItem(LOGIN_CREDS);
    if (_.isNull(d)) {
      return null;
    }
    const data = JSON.parse(d);
    if (!this.store.state.user.username) {
      this.store.commit('SET_USER', { username: data.username, passedQuiz: data.passedQuiz });
    }
    return data;
  }

  setLoginCreds(data: LoginCreds) {
    localStorage.setItem(LOGIN_CREDS, JSON.stringify(data));
    this.store.commit('SET_USER', { username: data.username, passedQuiz: data.passedQuiz });
  }

  forgetLoginCreds() {
    localStorage.removeItem(LOGIN_CREDS);
    this.store.commit('SET_USER', { username: '', passedQuiz: false });
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
