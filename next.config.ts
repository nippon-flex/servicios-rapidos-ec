import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/**/*': ['./node_modules/.prisma/client/libquery_engine-*.so.node'],
  },
};

export default nextConfig;