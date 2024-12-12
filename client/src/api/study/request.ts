import { url } from "@port-of-mars/client/util";
import { ProlificStudyData, ProlificParticipantStatus } from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class StudyAPI {
  constructor(public store: TStore, public ajax: AjaxRequest) {}

  async getProlificParticipantStatus(): Promise<ProlificParticipantStatus> {
    return this.ajax.get(url("/study/prolific/status"), ({ data, status }) => {
      if (status !== 200) {
        return null;
      }
      return data;
    });
  }

  async completeProlificStudy(): Promise<string> {
    return this.ajax.get(url("/study/prolific/complete"), ({ data }) => {
      return data;
    });
  }

  async getAllProlificStudies(): Promise<ProlificStudyData[]> {
    return this.ajax.get(url("/study/prolific/studies"), ({ data }) => {
      return data;
    });
  }

  async addProlificStudy(study: ProlificStudyData): Promise<ProlificStudyData> {
    return this.ajax.post(
      url("/study/prolific/add"),
      ({ data }) => {
        return data;
      },
      study
    );
  }

  async updateProlificStudy(study: ProlificStudyData): Promise<ProlificStudyData> {
    return this.ajax.post(
      url(`/study/prolific/update/?studyId=${study.studyId}`),
      ({ data }) => {
        return data;
      },
      study
    );
  }
}
