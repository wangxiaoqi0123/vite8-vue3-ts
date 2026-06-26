import { defineStore } from 'pinia'
import type { IUserInfo } from '/@/types/module/user'

interface UserState {
  userInfo?: IUserInfo
  menus: any[]
  pagePermissions: any[]
  featurePermissions: any[]
  cache: {
    isUserInfo: boolean
    isMenus: boolean
    isPagePermissions: boolean
    isFeaturePermissions: boolean
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    menus: [],
    pagePermissions: [],
    featurePermissions: [],
    cache: {
      isUserInfo: false,
      isMenus: false,
      isPagePermissions: false,
      isFeaturePermissions: false
    }
  }),

  getters: {
    userId(this: UserState) {
      return this.userInfo?.userId
    },
    featurePermissionCodes(): string[] {
      return (this.featurePermissions || []).map(item => item.permissionCode)
    },
    pagePermissionCodes(): string[] {
      return (this.pagePermissions || []).map(item => item.permissionCode)
    }
  },

  actions: {
    setUserInfo(data) {
      this.userInfo = data
      this.cache.isUserInfo = true
    },
    setMenus(menus) {
      this.menus = menus
      this.cache.isMenus = true
    },
    setPagePremission(pagePermissions) {
      this.pagePermissions = pagePermissions
      this.cache.isPagePermissions = true
    },
    setFeaturePermissions(featurePermissions) {
      this.featurePermissions = featurePermissions
      this.cache.isFeaturePermissions = true
    }
  }
})
