import { url } from "@port-of-mars/client/util";
import { AdminStats } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class AdminAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getData(): Promise<AdminStats> {
    try {
      return await this.ajax.get(url("/admin"), ({ data, status }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to retrieve AdminData");
      console.log(e);
      throw e;
    }
  }
}
