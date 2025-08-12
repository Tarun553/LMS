/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/projects-2025-71366.firebasestorage.app/**",
      },
    ],
  },
  experimental: {
    optimizeCss: false, // Disable lightningcss
  },
};

module.exports = nextConfig;
