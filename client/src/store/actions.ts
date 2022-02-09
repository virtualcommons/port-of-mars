import { url } from "@port-of-mars/client/util";

export default {

    async initTournamentStatus(context: any, { ajax } : { ajax: any }) {
        const STATUS_URL = url('/status/');
        console.log("Initializing store with tournament status data.", context);
        return await ajax.get(STATUS_URL, ({ data, status } : { data: any, status: any }) => {
            console.log("")
            if (data.user) {
                context.commit('SET_USER', data.user);
            }
            context.commit('SET_SIGNUP_ENABLED', data.isSignUpEnabled);
            context.commit('SET_TOURNAMENT_STATUS', data.tournamentStatus);
        });
    },

};