import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDocker = process.env.DOCKER_DEV === 'true'
  const target = isDocker
    ? env.VITE_APP_HOST_URL_DEV
    : env.VITE_APP_HOST_URL
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/sass/style.scss" as *;',
        },
      },
    },
  }
})
