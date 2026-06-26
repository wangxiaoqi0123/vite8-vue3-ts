import axios from 'axios'

interface IOptions<T = any> {
  cache?: boolean
  once?: boolean
  throttle?: boolean
  debounce?: boolean
  debounceDelay?: number
  ignoreCancel?: boolean
  onError?: (error?: any) => void
  onSuccess?: (data?: T) => void
  onBefore?: () => any
  onFinally?: () => void
  dataDefault?: any
}
type DefaultResType = (...args: any[]) => Promise<any> & {
  cancel: () => void
}
type ExtractResType<T> = T extends (...args: any[]) => Promise<infer R> ? R : any
type ExtractResData<T> = T extends { data: infer R } ? R : any
type ExtractReqArgs<T> = T extends (...args: infer R) => Promise<any> ? R : any
type Middleware = (args: any[], next: () => Promise<void>) => Promise<void>

class Onion {
  private middlewares: Middleware[] = []
  public use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }
  public async execute(args: any[]): Promise<void> {
    const next = async (index: number): Promise<void> => {
      if (index >= this.middlewares.length) {
        return
      }
      const currentMiddleware = this.middlewares[index]
      await currentMiddleware(args, () => next(index + 1))
    }
    await next(0)
  }
  public midClear() {
    this.middlewares = []
  }
}

export default function useFsRequest<T = DefaultResType>(request: T, options?: IOptions<ExtractResType<T>>) {
  options = Object.assign(
    {
      cache: false, // 数据缓存（没有数据请求，有数据不请求）
      once: false, // 请求成功之后不再请求
      throttle: false, // 请求节流（数据正在请求中再次发起请求，取消上一次请求）
      debounce: false, // 请求防抖

      debounceDelay: 300, // 防抖时间
      ignoreCancel: false, // 取消请求
      onError: () => {}, // 失败回调
      onSuccess: () => {}, // 成功回调
      onBefore: () => true, // 接口发起前
      onFinally: () => {},
      dataDefault: null
    },
    options
  )

  const app = new Onion()
  const data = ref<ExtractResData<ExtractResType<T>>>()
  const response = ref()
  const loading = ref(false)
  let isOnce = false
  let isCache = false
  let timerId = null
  let timerCalled = false
  let loadCount = 0

  data.value = options.dataDefault

  // 注意需要再回调中传出cancel
  const cancel = () => {
    loading.value = false
    const _request = request as any
    _request.cancel?.()
  }

  app.use(async (_args, next) => {
    const { ignoreCancel } = options
    if (ignoreCancel && loadCount > 0) {
      cancel()
    }
    await next()
  })

  app.use(async (_args, next) => {
    const { once } = options
    if (once) {
      if (isOnce) return
      await next()
      isOnce = true
    } else {
      await next()
    }
  })

  app.use(async (_args, next) => {
    const { cache } = options
    if (cache) {
      if (isCache) return
      await next()
      isCache = !!data.value
    } else {
      await next()
    }
  })

  app.use(async (_args, next) => {
    const { onBefore } = options
    const before = onBefore()
    if (before && before.then) {
      const flag = await before.then()
      if (flag === false) return
      await next()
    } else if (before !== false) {
      await next()
    }
  })

  app.use(async (_args, next) => {
    const { debounce, debounceDelay } = options
    if (debounce) {
      await new Promise((resolve, reject) => {
        if (!timerCalled) {
          timerCalled = true
          next().then(resolve).catch(reject)
        }
        if (timerId) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
          timerCalled = false
        }, debounceDelay)
      })
    } else {
      await next()
    }
  })

  app.use(async (_args, next) => {
    const { throttle } = options
    if (throttle) {
      if (loading.value) return
      await next()
    } else {
      await next()
    }
  })

  app.use(async (_args, next) => {
    loading.value = true
    loadCount++
    await next().finally(() => {
      loadCount--
      if (loadCount == 0) loading.value = false
    })
  })

  app.use(async args => {
    const { onSuccess, onFinally } = options
    const res = await (request as DefaultResType)(...args).finally(onFinally)
    response.value = res
    onSuccess(res)
    data.value = res
  })

  const run = async (...args: ExtractReqArgs<T>): Promise<ExtractResType<T>> => {
    const { onError } = options

    try {
      await app.execute(args)
    } catch (error) {
      onError(error)
      if (!axios.isCancel(error)) throw new Error(error, { cause: error })
    }
    return response.value
  }

  return {
    run,
    data,
    loading,
    cancel
  }
}
