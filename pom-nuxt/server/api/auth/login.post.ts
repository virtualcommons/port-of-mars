// import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// const { jwt } = jsonwebtoken;

export default defineEventHandler(async (event) => {
  const body = await useBody(event);
  const email = body.email;
  console.log("email: ", email);
  try {
    const email_hash = crypto.createHash("md5").update(email).digest("hex");
    console.log("email hash: ", email_hash);
    // const token: string = await jwt.sign({ email }, email_hash);
    const token = await jwt.sign(
      { email: "christine@ea.com" },
      "secrets.thesims"
    );
    let jwtCookie = getCookie(event, "authtoken") || "";
    jwtCookie = token;
    setCookie(event, "authtoken", jwtCookie);
    return token;
  } catch (error) {
    console.log("error: ", error);
  }
});
