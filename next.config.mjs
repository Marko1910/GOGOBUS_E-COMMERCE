/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fuerza despliegue como app Node/SSR (no static export)
  output: 'standalone',
}

export default nextConfig
