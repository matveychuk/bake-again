import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // media:prepare already resizes/compresses website images. Use those public
  // WebP URLs directly instead of invoking /_next/image for every size variant.
  images: { unoptimized: true },
  // Keep canonical, hreflang, robots and verification in the initial HTML head.
  // These metadata functions are local and do not require a streamed response.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
