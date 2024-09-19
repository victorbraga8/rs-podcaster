/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NEXT_DISABLED_DEBUG === "true",
  },
  env: {
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET,
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
    NEXT_DEBUG: "true",
    NEXT_PUBLIC_API_BACKEND_URL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
    NEXT_PUBLIC_PAIS_DEFAULT: process.env.NEXT_PUBLIC_PAIS_DEFAULT,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "7muvc5ty62b5nj6d.public.blob.vercel-storage.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api-management-encanto-experiencia.azure-api.net",
        port: "",
        pathname:
          "/api/cliente/v1/6bf07d8a52874acda0bbe8cb336585a5/get-file/**",
      },
    ],
  },
  swcMinify: true,
  reactStrictMode: true,
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "source-map"; // Gera mapas de origem para melhor depuração
    } else {
      config.cache = false;
    }
    config.snapshot = {
      ...(config.snapshot ?? {}),
      // Add all node_modules but @next module to managedPaths
      // Allows for hot refresh of changes to @next module
      managedPaths: [/^(.+?[\\/]node_modules[\\/])(?!@next)/],
    };
    return config;
  },
};

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
