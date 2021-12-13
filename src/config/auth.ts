export default {
  secret_token: process.env.APP_SECRET,
  expires_in_token: "1d",
  secret_refresh_token: process.env.APP_SECRET_REFRESH,
  expires_in_refresh_token: "30d",
  expires_refresh_token_days: 30,
};
