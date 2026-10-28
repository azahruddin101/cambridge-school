/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Admin photo uploads go through Server Actions (and the /admin proxy), both 1–10 MB by default
    serverActions: { bodySizeLimit: "40mb" },
    proxyClientMaxBodySize: "40mb",
  },
  // Keep links to the old WordPress site (e.g. /?page_id=379) working
  async redirects() {
    const legacyPages = {
      345: "/about",
      355: "/messages",
      360: "/messages",
      366: "/messages",
      372: "/administration",
      2: "/administration",
      377: "/admissions/student-strength",
      379: "/admissions/fee-structure",
      442: "/gallery",
    };
    return [
      ...Object.entries(legacyPages).map(([id, destination]) => ({
        source: "/",
        has: [{ type: "query", key: "page_id", value: id }],
        destination,
        permanent: true,
      })),
      { source: "/", has: [{ type: "query", key: "p", value: "343" }], destination: "/admissions", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
