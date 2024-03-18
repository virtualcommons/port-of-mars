import Vue, { VueConstructor } from "vue";
import _ from "lodash";
import { VueRouter } from "vue-router/types/router";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { RoomId } from "@port-of-mars/shared/types";
import {
  LOGIN_PAGE,
  FREE_PLAY_LOBBY_PAGE,
  CONSENT_PAGE,
  HOME_PAGE,
} from "@port-of-mars/shared/routes";
import { DashboardMessage } from "@port-of-mars/shared/types";
import { url } from "@port-of-mars/client/util";
import { initialUserState } from "@port-of-mars/shared/game/client/state";

declare module "vue/types/vue" {
  interface Vue {
    $ajax: AjaxRequest;
  }
}

interface ResponseData<T = any> {
  data: T;
  status: number;
}

export type AjaxResponse = Promise<any | void>;

export class AjaxResponseError extends Error {
  constructor(public data: DashboardMessage, public response: Response) {
    super(data.message);
  }
}

const SUBMISSION_ID = "submissionId";

export class AjaxRequest {
  constructor(private router: VueRouter, private store: TStore) {}

  _roomId?: RoomId;

  errorRoutes: Map<number, string> = new Map([
    [401, LOGIN_PAGE],
    [403, CONSENT_PAGE],
    [404, HOME_PAGE],
  ]);

  set roomId(r: RoomId | undefined) {
    this._roomId = r;
  }

  get roomId() {
    return this._roomId;
  }

  async forgetLoginCreds() {
    document.cookie = "connect.sid= ;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    this.store.commit("SET_USER", initialUserState);
    await this.get(url("/auth/logout"), () => {});
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
    // ASSUMPTION we always receive JSON back from the server given an ajax request
    // so server side should never do a res.redirect(..) for instance
    console.log("RECEIVED RESPONSE: ");
    console.log(response);
    const data = await response.json();
    if (response.status >= 400) {
      // something badwrong happened on the server side that we were not expecting.
      // push the error onto the store and move on.
      console.error("error response from server: ", response);
      const serverErrorMessage: DashboardMessage = data;
      this.store.commit("SET_DASHBOARD_MESSAGE", serverErrorMessage);
      if (response.status > 400) {
        const destinationPage = this.errorRoutes.has(response.status)
          ? this.errorRoutes.get(response.status)
          : CONSENT_PAGE;
        this.router.push({ name: destinationPage });
      }
    }
    return { data, status: response.status };
  }

  async post(
    path: string,
    done: (data: ResponseData) => Promise<any> | void,
    data?: any
  ): AjaxResponse {
    // FIXME: duplicated across post/get
    let response;
    try {
      response = await fetch(path, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data),
      });
      const responseData = await this.handleResponse(response);
      return done(responseData);
    } catch (e) {
      if (e instanceof AjaxResponseError) {
        throw e;
      } else {
        if (response && e instanceof Error) {
          throw new AjaxResponseError({ kind: "danger", message: e.message }, response);
        } else {
          console.error("Unhandled error in request, returning to home screen", e);
          // FIXME: add context so that login page has information about why they were redirected
          this.router.push({ name: LOGIN_PAGE });
        }
      }
    }
  }

  async get(path: string, done: (data: ResponseData) => Promise<any> | void): AjaxResponse {
    // FIXME: duplicated across post/get
    let response;
    try {
      response = await fetch(path, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      });
      const responseData = await this.handleResponse(response);
      return done(responseData);
    } catch (e) {
      if (e instanceof AjaxResponseError) {
        throw e;
      } else {
        if (response && e instanceof Error) {
          throw new AjaxResponseError({ kind: "danger", message: e.message }, response);
        } else {
          console.error("Unhandled error in request, returning to home screen", e);
          this.router.push({ name: HOME_PAGE });
        }
      }
    }
  }
}

export const Ajax = {
  install(instance: VueConstructor<Vue>, options: { router: VueRouter; store: TStore }) {
    instance.prototype.$ajax = new AjaxRequest(options.router, options.store);
  },
};
