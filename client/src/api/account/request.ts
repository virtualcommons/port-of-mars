import { url } from "@port-of-mars/client/util";
import { AuthData, ProfileData } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class AccountAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async grantConsent(): Promise<void> {
    try {
      await this.ajax.post(url("/account/grant-consent"), ({ data }) => {
        this.store.commit("SET_USER", data);
        this.store.commit("SET_DASHBOARD_MESSAGE", {
          kind: "info",
          message:
            "You have granted consent to participate in this research project. Welcome to the Port of Mars!",
        });
      });
    } catch (e) {
      console.log("Unable to deny consent");
      console.log(e);
      throw e;
    }
  }

  async denyConsent(): Promise<void> {
    try {
      await this.ajax.post(url("/account/deny-consent"), ({ data }) => {
        this.store.commit("SET_USER", data);
        this.store.commit("SET_DASHBOARD_MESSAGE", {
          kind: "info",
          message:
            "You have denied consent to participate in this research project. Sorry to see you go!",
        });
      });
    } catch (e) {
      console.log("Unable to deny consent");
      console.log(e);
      throw e;
    }
  }

  async updateProfile(profileData: ProfileData) {
    try {
      await this.ajax.post(
        url("/account/update-profile"),
        ({ data, status }) => {
          if (status !== 200) {
            throw new Error("Unable to update profile");
          }
          this.store.commit("SET_USER", data);
          if (data.isVerified) {
            this.store.commit("SET_DASHBOARD_MESSAGE", {
              kind: "success",
              message: "Profile updated successfully.",
            });
          } else {
            this.store.commit("SET_DASHBOARD_MESSAGE", {
              kind: "success",
              message: `Profile updated successfully, however you must verify your email.
               We have sent a confirmation email to ${profileData.email}.
               Please wait for it to arrive then click on the link inside to verify your email.
               It may take some time to arrive, and you may need to check your spam folder as well.
               You can close this browser window as the link will take you back to Port of Mars again.`,
            });
          }
        },
        profileData
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async authenticate(): Promise<AuthData | void> {
    try {
      return await this.ajax.get(url("/account/authenticated"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to authenticate user");
      console.log(e);
      throw e;
    }
  }
}
