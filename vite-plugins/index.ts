import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import legacy from '@vitejs/plugin-legacy'
import autoImport from './autoImport.ts'
import components from './components.ts'
import analyze from './analyze.ts'
import updateNotice from './updateNotice.ts'
import { svgIcons } from './svgIcons.ts'
import sentry from './sentry.ts'

export default function setupPlugins(mode, release) {
  return [
    vue(),
    Unocss(),
    legacy({ targets: ['defaults', 'not IE 11'] }),
    autoImport(),
    components(mode),
    svgIcons(),
    updateNotice(),
    analyze(),
    sentry(mode, release)
  ]
}
