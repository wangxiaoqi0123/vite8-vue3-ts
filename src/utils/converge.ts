/**
 * 多个*参数*相同异步函数只会执行期间只会执行一次，并返回相同的结果
 */
export function memoAsync<T = any>(fn: (this: T, ...args: any[]) => Promise<any>) {
  const cache = new Map<string, Promise<any>>()

  function getKey(args: any[]) {
    try {
      return JSON.stringify(args)
    } catch {
      return Symbol('non-serializable').toString()
    }
  }

  function execute(this: T, ...args) {
    const key = getKey(args)
    if (cache.has(key)) return cache.get(key)

    const promise = fn.call(this, ...args)
    cache.set(key, promise)
    promise.finally(() => {
      cache.delete(key)
    })
    return promise
  }

  return execute
}
