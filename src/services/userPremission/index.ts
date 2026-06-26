import config from '/@/config'
import { useUserStore } from '/@/store'

type TPage = keyof typeof config.page
type TFeature = keyof typeof config.feature

export function checkPage<T extends TPage>(...args: T[]) {
  if (args.length > 0) {
    const userStore = useUserStore()
    const keys: string[] = args.map(key => config.page[key])
    const codes = userStore.pagePermissionCodes
    const hasPermission = codes.some(role => keys.includes(role))
    return hasPermission
  } else {
    return false
  }
}

export function checkFeature<T extends TFeature>(...args: T[]) {
  if (args.length > 0) {
    const userStore = useUserStore()
    const keys: string[] = args.map(key => config.feature[key])
    const codes = userStore.featurePermissionCodes
    const hasPermission = codes.some(role => keys.includes(role))
    return hasPermission
  } else {
    return false
  }
}

export function checkLoginUser(userId) {
  const userStore = useUserStore()
  return userStore.userId === userId
}
