export default (res, token_name, token, duration) => {
  res.cookie(token_name, token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: new Date(Date.now() + (duration || 90 * 24 * 60 * 60 * 1000)),
    secure: process.env.NODE_ENV === "production",
  });
};
