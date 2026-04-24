import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Copy index.html → 404.html after build so Cloudflare Pages serves SPA for client routes
function copy404Plugin() {
  return {
    name: 'copy-404',
    closeBundle() {
      const out = path.resolve(__dirname, 'dist')
      const index = path.join(out, 'index.html')
      const notFound = path.join(out, '404.html')
      if (fs.existsSync(index)) fs.copyFileSync(index, notFound)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    copy404Plugin(),
  ],
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
    // sourcemaps slow Docker/Droplet builds; set SOURCEMAP=1 for debug builds
    sourcemap: process.env.SOURCEMAP === '1',
    reportCompressedSize: false,
    // Use '/' for web (Cloudflare Pages) so script/assets load from root and avoid MIME/404 issues on client routes.
    // For Capacitor/mobile, build uses same output; Capacitor loads from app origin.
    base: '/',
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
