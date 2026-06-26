import type { App } from 'vue'
import { createPinia } from 'pinia'
const store = createPinia()

export default function setupStore(app: App<Element>) {
  app.use(store)
}

export { store }
export * from '/@/store/modules/user'
export * from '/@/store/modules/system'
export * from '/@/store/modules/local'
export * from '/@/store/modules/dict'
