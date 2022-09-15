import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  // jwt provided in the header
  const authToken = event.req.headers.authentication;
  const secret = useRuntimeConfig().jwtSecretToken;
  if (authToken) {
    event.context.auth = { email: jwt.verify(authToken, secret).email };
  }
});