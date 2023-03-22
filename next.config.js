/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com', 'www.royalroadcdn.com'],
  },
}

module.exports = nextConfig
