const baseRouter: FRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('/@/layout/Index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/401',
        name: '401',
        component: () => import('/@/views/error/401.vue'),
        meta: {
          title: '401',
          leaveRemoveNav: route => !!route.query.redirect
        }
      },
      {
        path: '/:w+',
        name: '404',
        component: () => import('/@/views/error/404.vue'),
        meta: {
          title: '404'
        }
      }
    ]
  }
]

const modules = import.meta.glob('./modules/**/*.ts', {
  eager: true,
  import: 'default'
})

const getRoutes = (modules, baseRouter) => {
  const modulesRoutes: FRouteRecordRaw[] = []
  // 加入到路由集合中
  Object.keys(modules).forEach(key => {
    const mod = modules[key] || {}
    const modList = Array.isArray(mod) ? [...mod] : [mod]
    for (let i = 0; i < modList.length; i++) {
      modulesRoutes.push(modList[i])
    }
  })
  baseRouter[0].children = [...modulesRoutes, ...baseRouter[0].children]
  // 添加独立的授权路由（不在 layout 内）
  return [...baseRouter]
}

const routes = getRoutes(modules, baseRouter)

export default routes
