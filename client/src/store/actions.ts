import { url } from "@port-of-mars/client/util";
import { ClientInitData } from "@port-of-mars/shared/types";

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
    const data: ClientInitData = await response.json();
    if (data.user) {
      context.commit("SET_USER", data.user);
    }
    context.commit("SET_FREE_PLAY_ENABLED", data.isFreePlayEnabled);
    context.commit("SET_TOURNAMENT_ENABLED", data.isTournamentEnabled);
    return data.user;
  },
};
