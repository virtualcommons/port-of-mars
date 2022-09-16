import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // jwt provided in the authentication header
  const authToken = event.req.headers.authentication;
  const jwtSecretToken = useRuntimeConfig().jwtSecretToken;
  const email = await jwt.verify(authToken, jwtSecretToken).email 
  if (authToken) {
    event.context.auth = { email };
  }
});