import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: [
    // Local network
    "192.168.0.52",
    "192.168.0.1",
    // ngrok tunnels (all variants)
    "*.ngrok.io",
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.tekxai.com"
  ],
};

export default nextConfig;