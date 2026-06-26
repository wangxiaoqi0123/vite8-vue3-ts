import loginMiddleware from './loginMiddleware'
import dataMiddleware from './dataMiddleware'
import authMiddleware from './authMiddleware'

// 跳过所有中间件的路由白名单（这些路由不需要任何鉴权和数据加载）
const skipMiddlewareWhitelist = [
  '/',
  '/auth/feishu/callback' // 飞书授权回调页面
]

const middlewares = [loginMiddleware, dataMiddleware, authMiddleware]

const routerMiddleware = (to, from, next) => {
  // 白名单路由直接放行，跳过所有中间件
  if (skipMiddlewareWhitelist.includes(to.path)) {
    return next()
  }

  const stack = [...middlewares]
  const _next = (...args: any[]) => {
    if (args.length > 0 || stack.length === 0) {
      return next(...args)
    }
    const middleware = stack.shift()
    middleware(to, from, _next)
  }

  _next()
}

export default routerMiddleware
