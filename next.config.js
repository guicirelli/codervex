/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações de Compilação
  // swcMinify removido - é padrão no Next.js 15+
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Otimizações de Imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compressão e Minificação
  compress: true,
  poweredByHeader: false,
  
  // Otimizações Experimentais
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'react-hot-toast',
    ],
    // Turbopack gerencia cache automaticamente, não precisa configurar
  },
  
  // Headers de Performance
  async headers() {
    // Em desenvolvimento: não definir headers de cache
    // Deixa o Next.js gerenciar automaticamente para hot reload funcionar
    if (process.env.NODE_ENV === 'development') {
      return []
    }

    // Em produção: aplicar headers de segurança e cache otimizado
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/chunks/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Webpack Optimizations
  webpack: (config, { dev, isServer }) => {
    // Configuração de cache mais estável
    if (dev) {
      // Desabilitar cache do filesystem em desenvolvimento para evitar problemas
      config.cache = false
      
      // Garantir que módulos sejam resolvidos corretamente
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
        },
        // Evitar problemas com chunks ausentes
        fallback: {
          ...config.resolve.fallback,
        },
      }
      
      // Configurar output para evitar chunks ausentes
      config.output = {
        ...config.output,
        chunkFilename: 'static/chunks/[name].js',
        // Evitar hash em desenvolvimento para manter consistência
        filename: isServer ? '[name].js' : 'static/chunks/[name].js',
      }
      
      // Garantir que erros não quebrem o build
      config.optimization = {
        ...config.optimization,
        minimize: false, // Desabilitar minificação em dev para facilitar debug
      }
    }
    
    // Configurar logging do webpack para reduzir avisos não críticos
    config.infrastructureLogging = {
      level: 'error', // Só mostrar erros durante build
    }
    
    // Otimizações de produção
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier())
              },
              name(module) {
                const hash = require('crypto').createHash('sha1')
                hash.update(module.identifier())
                return hash.digest('hex').substring(0, 8)
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return require('crypto')
                  .createHash('sha1')
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8)
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
