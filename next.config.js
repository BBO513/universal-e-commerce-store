const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification for production
  i18n,
  images: {
    domains: [], // Add your image hostnames here (e.g., 'res.cloudinary.com')
  },
};

module.exports = nextConfig;
