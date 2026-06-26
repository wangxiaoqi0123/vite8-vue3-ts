import { http } from '../plugins'
import type { IUserInfo } from '../types/module/user'

export const getUsers = () => {
  return http.request<IUserInfo>({
    method: 'get',
    url: '/auth/getUserByToken'
  })
}

export const getMenus = () => {
  return http.request({
    method: 'get',
    url: '/menus/list/BizflowRightsPlatform'
  })
}

export const getPagePermissions = () => {
  return http.request({
    method: 'get',
    url: '/auth/fetchPagelist/BizflowRightsPlatform'
  })
}

export const getFeaturePermissions = () => {
  return http.request({
    method: 'get',
    url: '/auth/fetchPermissions/BizflowRightsPlatform'
  })
}

// 获取职务选项
export const getJobPostOptions = () => {
  return http.request({
    method: 'get',
    url: '/user/jobPostOptions'
  })
}
