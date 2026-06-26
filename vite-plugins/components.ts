import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 组件自动导入插件
 * 从 src/components/index.json 读取组件配置
 */
export default function createComponentsPlugin(mode: string) {
  const componentsDir = path.resolve(__dirname, '../src/components')
  const configFile = path.join(componentsDir, 'index.json')
  let componentCache = new Map<string, string>()

  function loadComponentConfig() {
    if (!fs.existsSync(configFile)) return console.warn('⚠️  components/index.json 文件不存在')

    try {
      const fileContent = fs.readFileSync(configFile, 'utf-8')
      const config = JSON.parse(fileContent)
      const newComponentCache = new Map<string, string>()
      if (config.components && typeof config.components === 'object') {
        Object.entries(config.components).forEach(([name, componentPath]) => {
          if (typeof componentPath === 'string') newComponentCache.set(name, componentPath)
        })
      }
      componentCache = newComponentCache
    } catch (err) {
      console.error('❌ 加载 components/index.json 失败:', err)
    }
  }

  loadComponentConfig()

  // 开发环境监听文件变化
  if (mode === 'development') {
    fs.watch(configFile, eventType => {
      if (eventType === 'change') {
        loadComponentConfig()
      }
    })
  }

  return Components({
    dirs: [],
    resolvers: [
      // 自定义组件解析器
      name => {
        const componentPath = componentCache.get(name)
        if (componentPath) return path.posix.resolve(__dirname, '../src/components', componentPath)
      },
      // Ant Design Vue 组件解析器
      AntDesignVueResolver({ importStyle: false })
    ],
    dts: 'src/types/auto-components.d.ts'
  })
}
