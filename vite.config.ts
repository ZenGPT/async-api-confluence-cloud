import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    port: 8080,
    host: 'localhost',
    allowedHosts: ['peng-new-8080.diagramly.ai'],
    proxy: {
      '/atlassian-connect.json': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: false,
        secure: false,
      },
      '/confluence-plugin': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: false,
        secure: false,
      },
      '/asyncapi-studio': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: false,
        secure: false,
      },
      '/asyncapi-viewer': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: false,
        secure: false,
      },
    },
  },

  // Build configuration
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          asyncapi: ['@asyncapi/react-component'],
        },
      },
    },
  },

  // Resolve configuration with Node.js polyfills
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      path: 'path-browserify',
      os: 'os-browserify/browser',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      util: 'util',
      url: 'url',
      assert: 'assert',
      http: 'stream-http',
      https: 'https-browserify',
      zlib: 'browserify-zlib',
      querystring: 'querystring-es3',
      process: 'process/browser',
    },
  },

  // Define global variables for Node.js polyfills
  define: {
    global: 'globalThis',
    'process.env': '{}',
    'process.versions.node': '"16.0.0"',
  },

  // CSS configuration
  css: {
    postcss: './postcss.config.js',
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'buffer',
      'process',
    ],
  },
})
