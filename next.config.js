/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
      bufferutil: false,
      'utf-8-validate': false,
    };
    return config;
  },
};

module.exports = nextConfig;