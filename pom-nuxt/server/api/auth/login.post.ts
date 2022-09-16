import jwt from "jsonwebtoken";
import { User } from "@/database/entities/User";

export default defineEventHandler(async (event) => {
  const nuxtApp = useNuxtApp();
  const body = await useBody(event);
  const email = body.email;
  const jwtSecret = useRuntimeConfig().jwtSecretToken;
  try {
    // FIXME: support actual authentication here when nuxt-auth is finally released
    const token: string = await jwt.sign(
      { email },
      jwtSecret
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
