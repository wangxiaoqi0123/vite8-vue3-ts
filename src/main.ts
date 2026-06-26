import { createApp } from 'vue'
import router from './router/index'
import setupStore from './store'
import App from './App.vue'
import registerGlobComponents from './components/registerGlobComponents'
import 'ant-design-vue/dist/reset.css'
import './styles/ant-design/index.less'
import 'virtual:svg-icons-register'
import './styles/style.less'
import 'uno.css'
import './assets/iconfont/iconfont.css'

async function bootstrap() {
  const app = createApp(App)

  app.use(router)

  registerGlobComponents(app)

  setupStore(app)

  app.mount('#app')
}

bootstrap()
