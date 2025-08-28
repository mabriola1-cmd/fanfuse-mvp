/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: false } // off since we’re on JS only
};
export default nextConfig;
