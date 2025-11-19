const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // Enable SWC minification for production
  i18n,
  images: {
    domains: ['your-image-domain.com', 'another-image-domain.com', 'via.placeholder.com'], // TODO: Replace with your actual image domains (e.g., Cloudinary, S3, etc.)
  },
};

module.exports = nextConfig;
