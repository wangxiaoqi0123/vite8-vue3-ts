import type { App } from 'vue'
import { FCreateModalPlugin } from '/@/plugins'

export default function registerGlobComponents(app: App) {
  app.use(FCreateModalPlugin)
}
