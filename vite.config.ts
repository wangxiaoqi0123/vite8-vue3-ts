import path from 'path'
import { type ConfigEnv, type UserConfig, defineConfig, loadEnv } from 'vite'
import setupPlugins from './vite-plugins/index.ts'
import dayjs from 'dayjs'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '')
  const release = `${dayjs().format('YYYYMMDDHHmmss')}_${env.VITE_APP_ENV}`

  return {
    base: env.VITE_PUBLIC_PATH,
    logLevel: 'info',
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: Number(env.VITE_PORT),
      host: env.VITE_HOST,
      allowedHosts: env.VITE_ALLOWEDHOSTS ? env.VITE_ALLOWEDHOSTS.split(',') : [],
      proxy: {
        '/api': {
          target: env.VITE_BASE_API_PROXY,
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api/, '')
        }
      }
    },
    plugins: setupPlugins(mode, release),
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 4000,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name].[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules/vue/') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue'
            }
            if (id.includes('@sentry/vue')) {
              return 'sentry'
            }
            const utils = ['axios', 'dayjs', 'mitt', 'nprogress']
            if (utils.some(lib => id.includes(`node_modules/${lib}/`))) {
              return 'utils'
            }
          }
        }
      }
    },
    define: {
      __VITE_APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __VITE_RELEASE__: JSON.stringify(release)
    }
  }
})
