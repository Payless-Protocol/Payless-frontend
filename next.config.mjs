/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // /retrieve is now the canonical route; keep old /recover links working.
    return [{ source: "/recover", destination: "/retrieve", permanent: false }];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@farcaster/mini-app-solana': false,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};

export default nextConfig;
