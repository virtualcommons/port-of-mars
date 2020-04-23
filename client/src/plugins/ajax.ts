import Vue, { VueConstructor } from 'vue'
import _ from "lodash";
import { VueRouter } from "vue-router/types/router";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { RoomId } from "@port-of-mars/shared/types";
import { LOGIN_PAGE, DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { ServerErrorMessage } from "@port-of-mars/shared/types";

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

type Reservation = {
  room: RoomListingData<any>;
  sessionId: string;
}

declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxRequest;
  }
}

const LOGIN_CREDS = 'loginCreds';
const SUBMISSION_ID = 'submissionId';

interface LoginCreds {
  sessionCookie: string
  username: string
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

  async setLoginCreds(response: Response) {
    response.json().then(loginCredentials => this.store.commit('SET_USER', { username: loginCredentials.username }));
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

  private async handleResponse(response: Response): Promise<Response> {
    switch (response.status) {
      case 401:
      case 403:
      case 404:
        const serverErrorMessage = await response.json();
        console.log("SOMETHING BAD HAPPENED, GOING BACK TO THE DASHBOARD");
        console.log(serverErrorMessage);
        this.store.commit('SET_ERROR_MESSAGE', serverErrorMessage);
        await this.router.push({ name: this.errorRoutes[response.status] })
        return response;
    }
    if (response.status >= 400) {
      // something badwrong happened on the server side that we were not expecting.
      // push the error onto the store and move on..
      this.store.commit('SET_ERROR_MESSAGE', { message: `Unexpected server response: ${response.text}` });
      // FIXME: should we be pushing back to the dashboard page again?
      await this.router.push({ name: DASHBOARD_PAGE });
    }
    return response;
  }

  async post(path: string, data?: any): Promise<Response> {
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
    )
    return await this.handleResponse(response);
  }

  async get(path: string): Promise<Response> {
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
    return await this.handleResponse(response);
  }
}

export const Ajax = {
  install(instance: VueConstructor<Vue>, options: { router: VueRouter, store: TStore }) {
    instance.prototype.$ajax = new AjaxRequest(options.router, options.store);
  }
};