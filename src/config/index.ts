import type { IConfig } from './types'
import commonConfig from './env'
import devConfig from './env.dev'
import prodConfig from './env.prod'
import sitConfig from './env.sit'
import preConfig from './env.pre'

const ENV = import.meta.env.VITE_APP_ENV

let config: IConfig = {} as any
switch (ENV) {
  case 'dev':
    config = Object.assign(commonConfig, devConfig)
    break
  case 'prod':
    config = Object.assign(commonConfig, prodConfig)
    break
  case 'sit':
    config = Object.assign(commonConfig, sitConfig)
    break
  case 'pre':
    config = Object.assign(commonConfig, preConfig)
    break

  default:
    break
}
export default config
