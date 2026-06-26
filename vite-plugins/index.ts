import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import legacy from '@vitejs/plugin-legacy'
import autoImport from './autoImport'
import components from './components'
import analyze from './analyze'
import updateNotice from './updateNotice'
import { svgIcons } from './svgIcons'
import sentry from './sentry'

export default function setupPlugins(mode, release) {
  console.log('release :>> ', release)
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
