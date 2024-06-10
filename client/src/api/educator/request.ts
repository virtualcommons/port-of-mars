import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import { StudentAuthData } from "@port-of-mars/shared/types";

export class EducatorAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async authTeacher(): Promise<boolean> {
    return true; //FIXME: needs to be implemented on the server
    try {
      return await this.ajax.get(url("/educator/authenticate-teacher"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to authenticate user");
      console.log(e);
      throw e;
    }
  }

  async authStudent(): Promise<StudentAuthData | void> {
    try {
      return await this.ajax.get(url("/educator/student"), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to authenticate student");
      console.log(e);
      throw e;
    }
  }

  async confirmStudent(formData: { name: string }) {
    try {
      await this.ajax.post(
        url("/educator/confirm-student"),
        ({ data, status }) => {
          if (status === 200) {
            return data;
          } else {
            return data;
          }
        },
        formData
      );
    } catch (e) {
      console.log("Unable to confirm student");
      console.log(e);
      throw e;
    }
  }
}
