const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

const path = require("path");

const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  webpack: (config, { isServer, buildId, dev, webpack }) => {
    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Resolve aliases based on tsconfig paths
    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.resolve(__dirname, "src"),
      public: path.resolve(__dirname, "public"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@api": path.resolve(__dirname, "src/api"),
    };

    return config;
  },
  images: {
    domains: ["www.thecocktaildb.com"], // Add domains for Next.js Image optimization
    unoptimized: true, // Disable optimization for images
  },
};

module.exports = withPWA(nextConfig);
