import { url } from "@port-of-mars/client/util";

export default {

    async init(context: any) {
        const STATUS_URL = url('/status/');
        console.log("Initializing store with tournament status data.", context);
        const response = await fetch(STATUS_URL,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrerPolicy: "no-referrer",
            }
        );
        if (response.status >= 400) {
            console.error("unable to contact server: ", response);
        }
        const data = await response.json();
        if (data.user) {
            context.commit('SET_USER', data.user);
        }
        context.commit('SET_SIGNUP_ENABLED', data.isSignUpEnabled);
        context.commit('SET_TOURNAMENT_STATUS', data.tournamentStatus);
        return data.user;
    },

};