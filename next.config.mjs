/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  ...(process.env.BUILD_DIST_DIR
    ? { distDir: process.env.BUILD_DIST_DIR }
    : {}),
};

export default nextConfig;
