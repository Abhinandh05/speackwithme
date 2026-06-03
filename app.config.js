// app.config.js — extends app.json with runtime env vars for PostHog
// Environment variables are read at build time (not runtime) in Expo.
const baseConfig = require("./app.json");

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  ...baseConfig.expo,
  android: {
    ...baseConfig.expo.android,
    package: "com.abhinandhc_31.speackwithme",
  },
  extra: {
    ...baseConfig.expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
    // Stream API key is safe to expose client-side (public app identifier).
    // STREAM_SECRET_KEY must only ever be read in server-side API routes.
    streamApiKey: process.env.STREAM_API_KEY,
  },
};
