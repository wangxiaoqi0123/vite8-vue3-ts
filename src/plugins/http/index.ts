import axios from 'axios'
import type { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'
import qs from 'qs'
import { AxiosCanceler } from './canceler'
import { httpError } from './httpError'
import { userService } from '/@/services'

interface HttpRequestConfig {
  baseApiType?: 'VITE_BASE_API' | 'VITE_BASE_AUTH_API'
  cancelRepeatRequest?: boolean
  showErrorMessage?: boolean
  responseFormat?: <T extends AxiosResponse, D>(response: T) => D
}

interface HttpRequest extends HttpRequestConfig, AxiosRequestConfig {
  headers: AxiosRequestHeaders
}

interface HttpPromise<T> extends Promise<T> {
  cancel?: (...args) => void
}

const env = import.meta.env
const axiosCanceler = new AxiosCanceler()

const defaultConfig: AxiosRequestConfig = {
  baseURL: env.VITE_BASE_API,
  timeout: 100000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  // 数组格式参数序列化
  paramsSerializer: params => qs.stringify(params, { indices: false })
}

class Http {
  constructor() {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }
  // 初始化配置对象
  private static initConfig: HttpRequestConfig = {
    cancelRepeatRequest: false,
    showErrorMessage: true,
    responseFormat: response => response.data?.data
  }

  private static axiosInstance = axios.create(defaultConfig)

  private httpInterceptorsRequest(): void {
    Http.axiosInstance.interceptors.request.use(
      (config: HttpRequest) => {
        const $config = config

        const token = userService.getToken()
        if (token) {
          $config.headers.token = token
        } else {
          userService.login()
          throw new Error('Token 不存在！')
        }

        // 扩展请求基础路径
        if ($config.baseApiType) $config.baseURL = env[$config.baseApiType]

        $config.cancelRepeatRequest && axiosCanceler.addPending(config)

        return $config
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  private httpInterceptorsResponse(): void {
    const instance = Http.axiosInstance
    instance.interceptors.response.use(
      response => {
        const $config = response.config as HttpRequest

        $config.cancelRepeatRequest && axiosCanceler.removePending($config)

        httpError({ response }, $config.showErrorMessage)

        return $config.responseFormat(response)
      },
      error => {
        const $config = error.config
        if (axios.isCancel(error)) {
          console.log('重复请求：' + error.message)
        } else {
          httpError(error, $config.showErrorMessage)
        }
        return Promise.reject(error)
      }
    )
  }

  public request<T = any>(config: AxiosRequestConfig, options?: HttpRequestConfig): Promise<T> {
    const conf = { ...config, ...Http.initConfig, ...options }
    return Http.axiosInstance.request(conf) as HttpPromise<T>
  }
}

export const http = new Http()

export { withCancel } from './withCancel'
export { default as upload } from './ajax-upload'
export { httpError }
