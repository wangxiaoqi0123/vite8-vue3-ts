import { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface Router {
    /** 静默导航标志：设置为 true 时跳过 progress */
    __skipProgress: boolean
  }
}

declare global {
  type FRouteMeta = {
    navs?: {
      name: string
      path: string
    }[]
    /**
     * 页面是否隐藏导航
     */
    hideNav?: boolean
    /**
     * 页面是否隐藏布局
     */
    hideLayout?: boolean
    /**
     * 页面是否需要固定间隙
     */
    contentStyle?: any
    /**
     * 页面显示的标题
     */
    title?: string
    /**
     * 页面需要的权限
     */
    permissions?: string[]
    /**
     * 是否需要缓存路由
     */
    keepAlive?: boolean
    /**
     * 是否在离开页面后隐藏导航
     */
    leaveRemoveNav?: boolean | ((route: any) => boolean)
    /**
     * 页面渲染组件的component的Key，默认不指定
     */
    pageKey?: (route: any) => boolean
  }

  type FRouteRecordRaw = RouteRecordRaw & {
    meta?: FRouteMeta
  }
}

export { FRouteMeta }
