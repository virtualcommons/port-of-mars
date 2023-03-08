import { VoteStartWithBots } from "../lobby";

export interface GetLeadDataWithBots {
  kind: "get-lead-data-with-bots";
  data?: any;
}

export interface GetLeadDataWithNoBots {
  kind: "get-lead-data-with-no-bots";
  data?: any;
}

export type LeadData = GetLeadDataWithBots | GetLeadDataWithNoBots;
