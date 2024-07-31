/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 0,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'evprmsgrfzkaomzxqbco.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**'
      },
    ],
    unoptimized: true,
  }
};

export default config;
