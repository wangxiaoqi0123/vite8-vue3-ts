import axios from 'axios'

type WithoutLastParameter<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
  ? P extends [...infer Rest, any]
    ? (...args: Rest) => ReturnType<T>
    : never
  : never

/**
 * 通用请求取消装饰器
 * @param fn
 * @returns
 */
export function withCancel<T extends (...args: any[]) => any>(fn: T) {
  let cancel: (() => void) | null = null
  const wrappedFunction = (...args) => {
    const cancelToken = new axios.CancelToken(c => (cancel = c))
    return fn(...args, cancelToken)
  }
  wrappedFunction.cancel = () => cancel?.()
  return wrappedFunction as WithoutLastParameter<T> & { cancel: () => void }
}
