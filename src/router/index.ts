import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { progress } from '../plugins'
import routerMiddleware from './middlewares'
import { destroyAllCreateContainModal } from '../plugins/createModal/createContainModal'

const router = createRouter({
  history: createWebHistory('/'),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, from, next) => {
  destroyAllCreateContainModal()
  progress.start()
  routerMiddleware(to, from, next)
})

router.afterEach(() => {
  progress.done()
  document.body.scrollTop = 0
})
export default router
