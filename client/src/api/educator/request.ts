import { url } from "@port-of-mars/client/util";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class EducatorAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async authenticateTeacher(): Promise<boolean> {
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
}
