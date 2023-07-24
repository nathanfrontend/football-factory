/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotedPatterns: [
      {
        protocol: "https",
        hostname: "crests.football-data.org",
        port: "3000",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
