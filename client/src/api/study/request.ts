import { url } from "@port-of-mars/client/util";
import {
  ProlificStudyData,
  ProlificSoloParticipantStatus,
  StudyMode,
  ProlificMultiplayerParticipantStatus,
} from "@port-of-mars/shared/types";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";

export class StudyAPI {
  mode: StudyMode;

  constructor(public store: TStore, public ajax: AjaxRequest, mode: StudyMode) {
    if (mode !== "solo" && mode !== "multiplayer" && mode !== "interactive") {
      throw new Error("Study mode must be 'solo', 'multiplayer', or 'interactive'");
    } else {
      this.mode = mode;
    }
  }

  async getProlificParticipantStatus(): Promise<
    ProlificSoloParticipantStatus | ProlificMultiplayerParticipantStatus
  > {
    return this.ajax.get(url(`/study/prolific/${this.mode}/status`), ({ data, status }) => {
      if (status !== 200) {
        return null;
      }
      return data;
    });
  }

  async completeProlificStudy(): Promise<string> {
    return this.ajax.get(url(`/study/prolific/${this.mode}/complete`), ({ data }) => {
      return data;
    });
  }

  async getAllProlificStudies(): Promise<ProlificStudyData[]> {
    return this.ajax.get(url(`/study/prolific/${this.mode}/studies`), ({ data }) => {
      return data;
    });
  }

  async addProlificStudy(study: ProlificStudyData): Promise<ProlificStudyData> {
    return this.ajax.post(
      url(`/study/prolific/${this.mode}/add`),
      ({ data }) => {
        return data;
      },
      study
    );
  }

  async updateProlificStudy(study: ProlificStudyData): Promise<ProlificStudyData> {
    return this.ajax.post(
      url(`/study/prolific/${this.mode}/update/?studyId=${study.studyId}`),
      ({ data }) => {
        return data;
      },
      study
    );
  }
}
