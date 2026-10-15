import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = Number(env.API_PORT || 8787)

  return {
    base: mode === 'production' ? '/Seconds-Digital/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: Number(env.PORT || 8443),
      strictPort: false,
      proxy: {
        '/api': `http://127.0.0.1:${apiPort}`,
        '/uploads': `http://127.0.0.1:${apiPort}`,
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
    },
    preview: {
      host: '0.0.0.0',
      port: Number(env.PREVIEW_PORT || env.PORT || 8443),
      strictPort: false,
      proxy: {
        '/api': `http://127.0.0.1:${apiPort}`,
        '/uploads': `http://127.0.0.1:${apiPort}`,
      },
    },
  }
})