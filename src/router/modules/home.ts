export default [
  {
    path: 'home',
    name: 'home',
    component: () => import('/@/views/home/index.vue'),
    meta: {
      title: '工作台',
      keepAlive: true
    }
  }
] as FRouteRecordRaw[]
