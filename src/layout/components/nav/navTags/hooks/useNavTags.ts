import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { isFunction } from 'lodash-es'
import { useUserStore } from '/@/store'

export interface INavTag {
  title: string
  path: string
  isTempRoute?: boolean
}

export enum NavCloseEnum {
  /** 关闭当前标签 */
  CLOSE_CURRENT = 'CLOSE_CURRENT',
  /** 关闭所有标签 */
  CLOSE_ALL = 'CLOSE_ALL',
  /** 关闭其他标签 */
  CLOSE_OTHER = 'CLOSE_OTHER',
  /** 关闭右侧标签 */
  CLOSE_RIGHT = 'CLOSE_RIGHT'
}

export function isSameTagNav(tag1: INavTag, tag2: INavTag) {
  return tag1.path === tag2.path
}

export default function useNavTags(router) {
  const userStore = useUserStore()

  let __skipProgress = false
  router.beforeEach(() => {
    __skipProgress = router.__skipProgress
  })

  const navTagsLocalKey = 'navTags'
  const userKey = userStore.userInfo?.userId
  const currentTag = computed(() => formatNavTag(router.currentRoute.value))

  /**
   * 处理导航标签local数据
   */
  const navTagsStore = {
    getAll: () => {
      try {
        const dataStr = localStorage.getItem(navTagsLocalKey)
        return JSON.parse(dataStr || '{}') as Record<string, INavTag[]>
      } catch {
        return {}
      }
    },
    get: () => {
      const allNavTags = navTagsStore.getAll()
      return allNavTags[userKey] || []
    },
    set: (vals: INavTag[]) => {
      const allNavTags = navTagsStore.getAll()
      allNavTags[userKey] = vals
      localStorage.setItem(navTagsLocalKey, JSON.stringify(allNavTags))
      navTagsLocalValue.value = vals
    }
  }
  /**
   * 处理本地存储的导航数据响应式
   */
  const navTagsLocalValue = ref(navTagsStore.get())
  const updateStoredValue = event => {
    if (event.key === navTagsLocalKey) {
      navTagsLocalValue.value = (JSON.parse(event.newValue) || {})[userKey] || []
    }
  }
  watchEffect(onCleaup => {
    window.addEventListener('storage', updateStoredValue)
    onCleaup(() => {
      window.removeEventListener('storage', updateStoredValue)
    })
  })

  /**
   * 监听路由变化
   */
  watch(
    () => router.currentRoute.value,
    to => {
      setNavTags(to)
    },
    { immediate: true }
  )

  /**
   * 处理导航的Url
   * @param route
   * @returns
   */
  function formatNavPath(route: RouteLocationNormalizedLoaded) {
    return route.fullPath
  }

  /**
   * 处理需要存储的导航数据
   * @param route
   * @returns
   */
  function formatNavTag(route: RouteLocationNormalizedLoaded): INavTag {
    return {
      title: (route.meta?.title || '') as string,
      path: formatNavPath(route),
      isTempRoute: getRouteIsTemp(route.meta?.leaveRemoveNav, route)
    }
  }

  /**
   * 管理路由数据
   * @param to
   * @param from
   * @returns
   */
  function setNavTags(to: RouteLocationNormalizedLoaded) {
    // 路由不是最末级路由，过滤
    if (to.matched[to.matched.length - 1]?.children?.length) {
      return
    }
    if (__skipProgress) {
      replaceNavTag(to)
    } else {
      addNavTag(to)
    }
    removeNavTag()
  }

  /**
   * 获取路由是否是临时路由
   * @param leaveRemoveNav
   * @returns
   */
  function getRouteIsTemp(leaveRemoveNav, route) {
    if (isFunction(leaveRemoveNav)) {
      return leaveRemoveNav(route)
    }
    return leaveRemoveNav
  }

  function addNavTag(to: RouteLocationNormalizedLoaded) {
    const navTags = navTagsStore.get()
    const tag = formatNavTag(to)
    if (!navTags.some(item => item.path === tag.path)) {
      navTags.push(tag)
      navTagsStore.set(navTags)
    }
  }

  /**
   * 静默导航时替换当前 nav tag 的 path（仅 query 变化，不新增标签）
   */
  function replaceNavTag(to: RouteLocationNormalizedLoaded) {
    const navTags = navTagsStore.get()
    const tag = formatNavTag(to)
    const idx = navTags.findIndex(item => item.path.split('?')[0] === tag.path.split('?')[0])
    if (idx !== -1) {
      navTags[idx].path = tag.path
      navTagsStore.set(navTags)
    }
  }

  function removeNavTag() {
    const navTags = navTagsStore.get()
    if (!navTags.length) return
    const newList = navTags.filter(nav => {
      return !nav.isTempRoute || nav.path === formatNavPath(router.currentRoute.value)
    })
    navTagsStore.set(newList)
  }

  /**
   * 关闭导航
   * @param tag
   * @param type
   * @param idx
   */
  function closeTagRouter(tag: INavTag, type: NavCloseEnum, idx?: number) {
    let navTags = navTagsStore.get()
    switch (type) {
      case NavCloseEnum.CLOSE_CURRENT:
        if (isSameTagNav(tag, currentTag.value)) {
          const prevTag = navTags[idx - 1]
          if (prevTag) {
            router.push(prevTag.path)
          } else {
            router.push('/')
          }
        }
        navTags.splice(idx, 1)
        navTagsStore.set(navTags)
        break

      case NavCloseEnum.CLOSE_ALL:
        navTagsStore.set([])
        router.push('/')
        break

      case NavCloseEnum.CLOSE_OTHER:
        navTagsStore.set([tag])
        if (!isSameTagNav(tag, currentTag.value)) {
          router.push(tag.path)
        }
        break

      case NavCloseEnum.CLOSE_RIGHT:
        navTags = navTags.slice(0, idx + 1)
        if (!navTags.some(itemTag => isSameTagNav(itemTag, currentTag.value))) {
          router.push(tag.path)
        }
        navTagsStore.set(navTags)
        break

      default:
        break
    }
  }

  /**
   * 打开导航路由
   * @param tag
   * @returns
   */
  function openTagRouter(tag: INavTag) {
    if (isSameTagNav(tag, currentTag.value)) return
    router.push(tag.path)
  }

  return {
    navTagsLocalValue,
    currentTag: computed(() => formatNavTag(router.currentRoute.value)),
    openTagRouter,
    closeTagRouter
  }
}
