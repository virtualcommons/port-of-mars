import { url } from "@port-of-mars/client/util";
import { ClientInitStatus } from "@port-of-mars/shared/types";

export default {
  async init(context: any) {
    const STATUS_URL = url("/status/");
    console.log("Initializing store with status data.", context);
    const response = await fetch(STATUS_URL, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    if (response.status >= 400) {
      console.error("unable to contact server: ", response);
    }
    const data: ClientInitStatus = await response.json();
    if (data.user) {
      context.commit("SET_USER", data.user);
    }
    if (data.tournamentStatus) {
      context.commit("SET_TOURNAMENT_STATUS", data.tournamentStatus);
    }
    if (data.tournamentRoundSchedule) {
      context.commit("SET_TOURNAMENT_ROUND_SCHEDULE", data.tournamentRoundSchedule);
    }
    context.commit("SET_FREE_PLAY_ENABLED", data.isFreePlayEnabled);
    context.commit("SET_TOURNAMENT_ENABLED", data.isTournamentEnabled);
    context.commit("SET_ANNOUNCEMENT_BANNER_TEXT", data.announcementBannerText);
    return data.user;
  },
};
