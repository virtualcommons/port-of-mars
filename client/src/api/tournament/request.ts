import { url } from "@port-of-mars/client/util";
import { TournamentRoundInviteStatus, TournamentStatus } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class TournamentAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getTournamentStatus(): Promise<TournamentStatus> {
    try {
      return this.ajax.get(url("/tournament/status"), ({ data }) => data);
    } catch (e) {
      console.log("Unable to get tournament status");
      console.log(e);
      throw e;
    }
  }

  async getInviteStatus(): Promise<TournamentRoundInviteStatus> {
    try {
      return this.ajax.get(url("/tournament/invite-status"), ({ data }) => data);
    } catch (e) {
      console.log("Unable to get tournament round invite status");
      console.log(e);
      throw e;
    }
  }
}
