import { cloneDeep } from 'lodash-es'
import { getFeaturePermissions, getMenus, getPagePermissions, getUsers } from '/@/api/user'
import { useUserStore } from '/@/store'

const homeMenu = {
  id: 1,
  menuType: 0,
  name: '工作台',
  pageUri: '/home',
  parentId: 0,
  permissionPageId: null,
  tag: 'icon-fs_2025040912icon'
}
const whitelist = ['/home']
const getPermissionMenus = (menus, uris: string[]): any[] => {
  uris = [...whitelist, ...uris]
  const list = []
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    if (menu.children?.length) {
      const children = getPermissionMenus(menu.children, uris)
      if (children?.length) {
        menu.children = children
        list.push(menu)
      }
    } else if (uris.includes(menu.pageUri)) {
      list.push(menu)
    }
  }
  return list
}
const permissionMenus = (pagePermissions, menus) => {
  if (!pagePermissions?.length) return []
  const pagePermissionUris = pagePermissions.map(item => item.pageUri)
  return getPermissionMenus(cloneDeep(menus || []), pagePermissionUris)
}

class GetUserData {
  userInfo: any
  menus: any
  pagePermissions: any
  featurePermissions: any
  async getUserInfo() {
    this.userInfo = await getUsers()
  }
  async getMenus() {
    this.menus = await getMenus()
    if (this.menus?.length) this.menus.unshift(homeMenu)
  }
  async getPagePermissions() {
    this.pagePermissions = await getPagePermissions()
  }
  async getFeaturePermissions() {
    this.featurePermissions = await getFeaturePermissions()
  }
  async getUserData() {
    const userStore = useUserStore()
    const reqList = []
    if (!userStore.cache.isUserInfo) {
      reqList.push(this.getUserInfo())
    }
    if (!userStore.cache.isMenus) {
      reqList.push(this.getMenus())
    }
    if (!userStore.cache.isPagePermissions) {
      reqList.push(this.getPagePermissions())
    }
    if (!userStore.cache.isFeaturePermissions) {
      reqList.push(this.getFeaturePermissions())
    }
    await Promise.all(reqList)
    userStore.setUserInfo(this.userInfo)
    userStore.setMenus(permissionMenus(this.pagePermissions, this.menus))
    userStore.setPagePremission(this.pagePermissions)
    userStore.setFeaturePermissions(this.featurePermissions)
  }
}

export default GetUserData
