
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
  webpack: (config, { isServer }) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true, topLevelAwait: true };

    // Only apply client-side fallbacks for browser environment
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            path: require.resolve('path-browserify'),
            os: require.resolve('os-browserify/browser'),
            constants: require.resolve('constants-browserify'),
            util: require.resolve('util'),
            fs: false, 
        };
    }
    
    return config;
  },
};

export default nextConfig;
