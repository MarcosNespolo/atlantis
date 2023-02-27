/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  serverRuntimeConfig: {
    // Define o tamanho máximo do corpo da requisição em bytes.
    maxBodySize: '10mb',
  },
}

module.exports = nextConfig
