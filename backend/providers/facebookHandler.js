export async function facebookHandler(code, config) {
  const tokenRes = await fetch(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${config.clientId}&redirect_uri=${config.callbackUrl}&client_secret=${config.clientSecret}&code=${code}`
  );
  const tokenData = await tokenRes.json();

  const profileRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
  );
  const profile = await profileRes.json();

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.picture?.data?.url,
  };
}
