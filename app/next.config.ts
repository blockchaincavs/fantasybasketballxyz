import type { NextConfig } from 'next';

/**
 * Next.js config. The front end has no secrets. With no setup it connects to the Dev database of
 * `fbx-dev` (see `src/lib/config.ts`); `app/.env.local` can override the public `NEXT_PUBLIC_*` ids.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Don't write an AGENTS.md into app/ on `next dev` (the repo has its own).
  agentRules: false,
};

export default nextConfig;
