import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow OpenWeatherMap images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },
};

export default nextConfig;
