import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep canonical, hreflang, robots and verification in the initial HTML head.
  // These metadata functions are local and do not require a streamed response.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
