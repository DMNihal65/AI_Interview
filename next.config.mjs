// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/dashboard',
          permanent: true, // This makes it a 308 redirect for SEO purposes
        },
      ];
    },
  };
  
  export default nextConfig;
  