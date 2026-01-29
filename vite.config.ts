import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { createHtmlPlugin } from 'vite-plugin-html'
import { resolve } from 'node:path'
import { getSVGSymbolsString } from './scripts/svg'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        minify: true,
        entry: 'src/main.ts',
        template: 'index.html',
        inject: {
          data: {
            injectSVGSymbols: await getSVGSymbolsString(resolve('src/icons')),
          },
          tags: [
            {
              injectTo: 'body-prepend',
              tag: 'div',
              attrs: {
                id: 'app',
              },
            },
          ],
        },
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_APP_HOST_URL,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/sass/style.scss" as *;',
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }
})
