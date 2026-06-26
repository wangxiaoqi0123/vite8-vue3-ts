import { useUserStore } from '/@/store'

const whitelist = ['/401', '/404']

// 路由鉴权
export default (to, _from: any, next: any) => {
  const permissions = (to.meta?.permissions as string[]) || []

  const userStore = useUserStore()
  const codes = userStore.pagePermissionCodes || []
  const url = to.path

  // 非白名单页面在页面权限为空时，不能访问
  if (!whitelist.includes(url) && codes.length === 0) {
    return next({ path: '/401' })
  }

  // 配置权限校验
  if (permissions.length) {
    const hasPermission = codes.some(role => {
      return permissions.includes(role)
    })

    if (hasPermission) {
      next()
    } else {
      next({ path: '/401' })
    }
  } else {
    // 无配置，直接放行
    next()
  }
}
