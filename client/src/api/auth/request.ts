import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import {
  CONSENT_PAGE,
  FREE_PLAY_LOBBY_PAGE,
  STUDENT_CONFIRM_PAGE,
  TEACHER_DASHBOARD_PAGE,
} from "@port-of-mars/shared/routes";
import VueRouter from "vue-router";

export class AuthAPI {
  constructor(public store: TStore, public ajax: AjaxRequest, public router: VueRouter) {}

  async devLogin(formData: { username: string; password: string }, shouldSkipVerification = true) {
    try {
      const devLoginUrl = url(`/auth/dev-login?shouldSkipVerification=${shouldSkipVerification}`);
      await this.ajax.post(
        devLoginUrl,
        ({ data, status }) => {
          if (status === 200) {
            this.store.commit("SET_USER", data.user);
            // FIXME: not terribly important but we might want to move to the tournament dashboard if isTournamentEnabled
            if (data.user.isVerified) this.router.push({ name: FREE_PLAY_LOBBY_PAGE });
            else this.router.push({ name: CONSENT_PAGE });
          } else {
            return data;
          }
        },
        formData
      );
    } catch (e) {
      console.log("Unable to login");
      console.log(e);
      throw e;
    }
  }

  async studentLogin(classroomAuthToken: string) {
    try {
      const loginUrl = url("/auth/student-login");
      await this.ajax.post(
        loginUrl,
        ({ data, status }) => {
          if (status === 200) {
            this.store.commit("SET_USER", data.user);
            this.router.push({ name: STUDENT_CONFIRM_PAGE });
          } else {
            return data;
          }
        },
        { classroomAuthToken, password: "unused" }
      );
    } catch (e) {
      console.log("Unable to login");
      console.log(e);
      throw e;
    }
  }

  async teacherLogin(formData: { username: string; password: string }){
    try {
      const teacherLoginUrl = url("/auth/teacher-login");
      await this.ajax.post(
        teacherLoginUrl,
        ({ data, status }) => {
          if (status === 200){
            this.store.commit("SET_USER", data.user);
            this.router.push({ name: TEACHER_DASHBOARD_PAGE}); //temporary push
          } else {
            return data;
          }
        },
        formData
      );
    } catch (e) {
      console.log("Unable to login");
      console.log(e);
      throw e;
  }
}
}