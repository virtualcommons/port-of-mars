import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  // jwt provided in the authentication header
  const authToken = event.req.headers.authentication;
  const jwtSecretToken = useRuntimeConfig().jwtSecretToken;
  if (authToken) {
    const email = await jwt.verify(authToken, jwtSecretToken).email 
    event.context.auth = { email };
  }
});
