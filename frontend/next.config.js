/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  async redirects() {
    return [
      {
        source: '/dashboard/weeks/:weekId',
        destination: '/dashboard/weeks/:weekId/horses',
        permanent: true,
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true, // ! disable to avoid build error
  }
};

module.exports = nextConfig;
