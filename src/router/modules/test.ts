const isDevelopment = import.meta.env.VITE_APP_ENV === 'dev'
export default [
  isDevelopment && {
    path: 'test/component',
    name: 'test.component',
    component: () => import('/@/views/__test__/index.vue'),
    meta: {
      navs: [{ name: '测试页面', path: '' }],
      title: '组件测试'
    }
  }
].filter(Boolean)
