import jwt from "jsonwebtoken";
import { User } from "@port-of-mars/nuxt/dashboard/entities/User";
import crypto from "crypto";

export default defineEventHandler(async (event) => {
  const nuxtApp = useNuxtApp();
  const body = await useBody(event);
  const email = body.email;
  console.log("email: ", email);
  try {
    // FIXME: support actual authentication here when nuxt-auth is finally released
    const token: string = await jwt.sign(
      { email },
      useRuntimeConfig().jwtSecretToken
    );
    let jwtCookie = getCookie(event, "authtoken") || "";
    jwtCookie = token;
    const user = await nuxtApp
      .$getDataSource()
      .getRepository(User)
      .findOneBy({ email });
    setCookie(event, "authtoken", jwtCookie);
    return { user, token };
  } catch (error) {
    console.log("error: ", error);
  }
});
