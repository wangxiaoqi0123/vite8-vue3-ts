import { sentryVitePlugin } from '@sentry/vite-plugin'
const authToken =
  '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'
export default function sentry(mode, release) {
  // 开发环境、分析构建不接入Sentry
  if (['development'].includes(mode) || process.env.analyze) return null
  return sentryVitePlugin({
    url: 'https://sentry.fs.com',
    org: 'sentry',
    project: 'bizflow',
    authToken,
    telemetry: false,
    release: {
      name: release,
      deploy: { env: mode }
    },
    sourcemaps: {
      assets: 'dist/assets/**',
      ignore: ['node_modules'],
      filesToDeleteAfterUpload: 'dist/**/*.map'
    },
    errorHandler: err => console.log('sentry error:', err)
  })
}
