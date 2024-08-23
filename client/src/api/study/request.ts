import { url } from "@port-of-mars/client/util";
import { ProlificParticipantStatus } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class StudyAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getProlificParticipantStatus(): Promise<ProlificParticipantStatus> {
    return await this.ajax.get(url("/study/prolific/status"), ({ data }) => {
      return data;
    });
  }
}
