import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import {
  CLASSROOM_LOBBY_PAGE,
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
            throw new Error(data.message || "Login failed");
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

  async studentRejoin(rejoinCode: string) {
    const rejoinUrl = url("/auth/student-rejoin");
    await this.ajax.post(
      rejoinUrl,
      ({ data, status }) => {
        if (status === 200) {
          console.log(data);
          this.store.commit("SET_USER", data.user);

          if (data.user.isVerified){
            console.log("Student verified");
            this.router.push({ name: CLASSROOM_LOBBY_PAGE });
          }else {
            console.log("Student not verified");
            this.router.push({ name: STUDENT_CONFIRM_PAGE });
          }
          
        } else {
          throw new Error(data.message || "Rejoin failed");
        }
      },
      { rejoinCode, password: "unused" }
    );
  }
  catch(e: any) {
    console.log("Unable to rejoin");
    console.log(e);
    throw e;
  }

  async teacherLogin(formData: { username: string; password: string }) {
    try {
      const loginUrl = url("/auth/teacher-login");
      await this.ajax.post(
        loginUrl,
        ({ data, status }) => {
          if (status === 200) {
            this.store.commit("SET_USER", data.user);
            this.router.push({ name: TEACHER_DASHBOARD_PAGE });
          } else {
            throw new Error(data.message || "Login failed");
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
