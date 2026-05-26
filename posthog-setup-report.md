<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the SpeakWithMe Expo app. The SDK (`posthog-react-native` + `react-native-svg`) was installed, environment variables were wired through `app.config.js` → `expo-constants`, a `PostHogProvider` was added to the root layout with manual screen tracking, and 12 events were instrumented across 5 screens. Users are identified by email on successful sign-in and sign-up (both email and OAuth flows).

## Events instrumented

| Event | Description | File |
|---|---|---|
| `onboarding_get_started_tapped` | User taps "Get Started" on the onboarding screen — top of sign-up funnel | `app/onboarding.tsx` |
| `sign_up_submitted` | User submits the email + password sign-up form | `app/(auth)/signup.tsx` |
| `sign_up_completed` | User successfully verifies email code and account is created | `app/(auth)/signup.tsx` |
| `sign_up_oauth_started` | User taps a social OAuth button (Google, Facebook, Apple) on sign-up | `app/(auth)/signup.tsx` |
| `sign_up_oauth_completed` | User successfully signs up via OAuth provider | `app/(auth)/signup.tsx` |
| `sign_in_submitted` | User submits the email sign-in form | `app/(auth)/signin.tsx` |
| `sign_in_completed` | User successfully verifies email code and signs in | `app/(auth)/signin.tsx` |
| `sign_in_oauth_started` | User taps a social OAuth button (Google, Facebook, Apple) on sign-in | `app/(auth)/signin.tsx` |
| `sign_in_oauth_completed` | User successfully signs in via OAuth provider | `app/(auth)/signin.tsx` |
| `language_selected` | User taps a language card on the language selection screen | `app/language-selection.tsx` |
| `language_confirmed` | User confirms their language choice and proceeds to the app | `app/language-selection.tsx` |
| `home_continue_lesson_tapped` | User taps "Continue" on the home screen lesson card | `app/(tabs)/home.tsx` |

## Files created / modified

- **Created** `lib/posthog.ts` — PostHog client singleton using `expo-constants`
- **Created** `app.config.js` — exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` as Expo extras
- **Created** `.env` — stores `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (gitignored)
- **Modified** `app/_layout.tsx` — added `PostHogProvider` with autocapture and manual screen tracking
- **Modified** `app/onboarding.tsx` — `onboarding_get_started_tapped`
- **Modified** `app/(auth)/signup.tsx` — sign-up events + `posthog.identify()` + error capture
- **Modified** `app/(auth)/signin.tsx` — sign-in events + `posthog.identify()` + error capture
- **Modified** `app/language-selection.tsx` — language selection and confirmation events
- **Modified** `app/(tabs)/home.tsx` — lesson engagement event

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1629667)
- [Sign-up & Sign-in Funnel (Onboarding → Completed)](/insights/CEZzm69G) — conversion funnel from onboarding through language confirmation
- [Daily Sign-ups & Sign-ins](/insights/Fds7S4kG) — email and OAuth auth volume over time
- [OAuth Provider Breakdown](/insights/XFeEktRH) — which OAuth providers (Google, Facebook, Apple) users prefer
- [Language Selection Rate](/insights/El39uBbz) — language taps vs. confirmed selections (drop-off indicator)
- [Home Lesson Engagement](/insights/KK0KzWgq) — how often users tap "Continue" to resume lessons

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
