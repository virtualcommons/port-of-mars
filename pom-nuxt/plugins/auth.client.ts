import createAuth0 from "@auth0/auth0-vue";

export default defineNuxtPlugin(async (nuxtApp) => {

  const auth = await createAuth0({
    domain: "portofmars.us.auth0.com",
    client_id: "5r9FVy8Bq1FSeIMUv2AtzVpS8gcERYRf",
    redirect_uri: window.location.origin
  });
  return {
    provide: { auth }
  };

});
