/** @type {import('next').NextConfig} */

module.exports = {
  // Other Next.js config options...
//   reactStrictMode: true,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  },
  runtimeCaching: [
    {
      urlPattern: /^http?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
        networkTimeoutSeconds: 10, // Timeout for network requests
      },
    },
  ],
}
