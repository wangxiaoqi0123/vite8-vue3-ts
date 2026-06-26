import commonConfig from './env'

export interface IEnvConfig {
  // TODO
  [key: string]: any
}

export type IEnvConfigType = typeof commonConfig
export interface IConfig extends IEnvConfig, IEnvConfigType {
  [key: string]: any
}

export type ITableOperatKey = IEnvConfigType['tableOperatKeys'][keyof IEnvConfigType['tableOperatKeys']]
