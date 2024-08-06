/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `` | `/(calendar)` | `/(home)` | `/(onboarding)/onboarding` | `/(profile)` | `/(protected)` | `/(public)` | `/(shop)` | `/(tabs)` | `/_header` | `/_sitemap` | `/assistance` | `/calendar` | `/create-report` | `/create-request` | `/home` | `/onboarding` | `/orari` | `/profile` | `/profile-edit` | `/profile-home` | `/repid` | `/reports` | `/reqid` | `/requests` | `/shop` | `/sign-in` | `/sign-up`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/[info]` | `/[slug]`;
    }
  }
}
