/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 
              'images.unsplash.com', 
              'www.royalroadcdn.com', 
              'nexuslit.s3.us-east-2.amazonaws.com',
              'nexuslit-avatars.s3.us-east-2.amazonaws.com'
            ],
    minimumCacheTTL: 15,
  }
}

module.exports = nextConfig
