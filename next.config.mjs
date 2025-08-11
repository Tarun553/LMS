/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless"],
  },
  images: {
    domains: [
      "placehold.co",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Enable SWC minification
  swcMinify: true,
  // Configure page extensions
  pageExtensions: ["tsx", "ts", "jsx", "js", "mdx"],

  // Add webpack configuration to handle lightningcss
  webpack: (config, { isServer }) => {
    // Exclude lightningcss from being processed by webpack
    config.externals = config.externals || {};
    config.externals["lightningcss"] = "lightningcss";

    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
