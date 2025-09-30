import { OAuth2Client } from "google-auth-library";

export async function googleHandler(code, config) {
  const client = new OAuth2Client(
    config.clientId,
    config.clientSecret,
    config.callbackUrl
  );

  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.clientId,
  });
  const payload = ticket.getPayload();

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
  };
}
