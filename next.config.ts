import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, {isServer}) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // The firebase-admin SDK and its dependencies need polyfills for certain
    // Node.js modules when being bundled, even for server-side code in some
    // Next.js environments (like the Edge runtime build pass).
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
      os: require.resolve('os-browserify/browser'),
      constants: require.resolve('constants-browserify'),
      fs: false, // fs cannot be polyfilled, but we can tell webpack to ignore it.
    };
    
    return config;
  },
};

export default nextConfig;
