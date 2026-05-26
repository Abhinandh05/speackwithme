// app.config.js — extends app.json with runtime env vars for PostHog
// Environment variables are read at build time (not runtime) in Expo.
const baseConfig = require("./app.json");

/** @type {import('@expo/config').ExpoConfig} */
module.exports = {
  ...baseConfig.expo,
  extra: {
    ...baseConfig.expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
};
