const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
});

const nextConfig = {
  reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

const additionalConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"], // Use SVGR for handling SVG files
    });
    return config;
  },
  images: {
    domains: ["www.thecocktaildb.com"], // Add domains for Next.js Image optimization
    unoptimized: true, // Disable optimization for images
  },
};

const finalConfig = {
  ...nextConfig,
  ...additionalConfig,
};

module.exports = withPWA(finalConfig);
