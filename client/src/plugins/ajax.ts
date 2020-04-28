import Vue, { VueConstructor } from 'vue'
import _ from "lodash";
import { VueRouter } from "vue-router/types/router";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { RoomId } from "@port-of-mars/shared/types";
import { LOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { DashboardMessage } from "@port-of-mars/shared/types";
import { url } from "@port-of-mars/client/util";

interface RoomListingData<Metadata = any> {
  clients: number;
  locked: boolean;
  private: boolean;
  maxClients: number;
  metadata: Metadata;
  name: string;
  processId: string;
  roomId: string;

  updateOne(operations: any): any;

  save(): any;

  remove(): any;
}

declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxRequest;
  }
}

const SUBMISSION_ID = 'submissionId';

interface LoginCreds {
  sessionCookie: string
  username: string
}

interface ResponseData<T=any> {
  data: T
  status: number
}

export type AjaxResponse = Promise<any | void>;

export class AjaxResponseError extends Error {
  constructor(public data: DashboardMessage, public response: Response) {
    super(data.message);
  }
}

export class AjaxRequest {
  constructor(private router: VueRouter, private store: TStore) {
  }

  _roomId?: RoomId;

  errorRoutes = {
    401: LOGIN_PAGE,
    403: DASHBOARD_PAGE,
    404: DASHBOARD_PAGE
  }

  set roomId(r: RoomId | undefined) {
    this._roomId = r;
  }

  get roomId() {
    return this._roomId
  }

  setLoginCreds(loginCredentials: { username: string }) {
    this.store.commit('SET_USER', loginCredentials);
  }

  async devLogin(formData: { username: string, password: string }) {
    const devLoginUrl = url('/login');
    await this.post(devLoginUrl, ({data, status}) => {
      if (status === 200) {
        this.setLoginCreds(data);
        this.router.push({ name: DASHBOARD_PAGE });
      } else {
        return data;
      }
    }, formData);
  }

  get username(): string {
    return this.store.state.user.username;
  }

  setQuizCompletion(passedQuiz: boolean) {
    this.store.commit('SET_USER', { username: this.username, passedQuiz });
  }

  forgetLoginCreds() {
    document.cookie = "connect.sid= ;expires=Thu, 01 Jan 1970 00:00:00 GMT";
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

  private async handleResponse(response: Response): Promise<ResponseData> {
    switch (response.status) {
      case 401:
      case 403:
      case 404:
        const serverErrorMessage: DashboardMessage = await response.json();
        console.log(serverErrorMessage);
        this.store.commit('SET_DASHBOARD_MESSAGE', serverErrorMessage);
        this.router.push({ name: this.errorRoutes[response.status] })
        throw new AjaxResponseError(serverErrorMessage, response);
    }
    if (response.status >= 400) {
      // something badwrong happened on the server side that we were not expecting.
      // push the error onto the store and move on..
      const serverErrorMessage: DashboardMessage = { kind: 'danger', message: `Unexpected server response: ${response.text}` };
      this.store.commit('SET_DASHBOARD_MESSAGE', serverErrorMessage);
      // FIXME: should we be pushing back to the dashboard page again?
      this.router.push({ name: DASHBOARD_PAGE });
      throw new AjaxResponseError(serverErrorMessage, response);
    }
    return { data: await response.json(), status: response.status };
  }

  async post(path: string, done: (data: ResponseData) => Promise<any> | void, data?: any): AjaxResponse {
    const response = await fetch(
      path,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      }
    );
    // FIXME: duplicated across post/get
    try {
      const responseData = await this.handleResponse(response);
      return done(responseData);
    }
    catch (e) {
      if (e instanceof AjaxResponseError) {
        throw e;
      }
      else {
        throw new AjaxResponseError({ kind: 'danger', message: e.message }, response);
      }
    }
  }

  async get(path: string, done: (data: ResponseData) => Promise<any> | void): AjaxResponse {
    const response = await fetch(
      path,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: "no-referrer",
      }
    );
    // FIXME: duplicated across post/get
    try {
      const responseData = await this.handleResponse(response);
      return done(responseData);
    }
    catch (e) {
      if (e instanceof AjaxResponseError) {
        throw e;
      }
      else {
        throw new AjaxResponseError({ kind: 'danger', message: e.message }, response);
      }
    }
  }
}

export const Ajax = {
  install(instance: VueConstructor<Vue>, options: { router: VueRouter, store: TStore }) {
    instance.prototype.$ajax = new AjaxRequest(options.router, options.store);
  }
};