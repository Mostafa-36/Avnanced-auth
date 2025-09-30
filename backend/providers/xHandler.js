export async function xHandler(code, config) {
  const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${config.clientId}:${config.clientSecret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: config.callbackUrl,
      code_verifier: config.codeVerifier,
    }),
  });
  const tokenData = await tokenRes.json();

  const profileRes = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await profileRes.json();

  return {
    id: profile.data.id,
    email: profile.data.email,
    name: profile.data.name,
  };
}
