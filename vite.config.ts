import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [// The React and Tailwind plugins are both required for Make, even if
  // Tailwind is not being actively used – do not remove them
  react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Disable caching in development to prevent stale component issues
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    // Force reload on file changes
    hmr: {
      overlay: true,
    },
    watch: {
      // Use polling to ensure file changes are detected
      usePolling: false,
      interval: 100,
    },
  },
  // Optimize dependency handling
  optimizeDeps: {
    // Force dependency re-optimization
    force: false,
    // Exclude motion/react from pre-bundling to ensure fresh builds
    exclude: [],
  },
  build: {
    // Ensure source maps for better debugging
    sourcemap: true,
    // Set base path for mobile app
    base: './',
    // Optimize for mobile
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
})