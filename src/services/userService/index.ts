import Cookies from 'js-cookie'
import { httpError } from '/@/plugins'
import GetUserData from './getUserData'

const envConfig = import.meta.env

abstract class UserService {
  abstract login(): void

  abstract logout(): void

  abstract getToken(): string | null

  abstract isAuthenticated(): boolean
}

class OUserService extends UserService {
  private userReq: GetUserData
  constructor() {
    super()
    this.userReq = new GetUserData()
  }
  login() {
    const { href } = window.location
    const url = `${envConfig.VITE_SSO_REDIRECT_LOGIN_PATH}?redirect_url=${encodeURIComponent(href)}`
    window.location.replace(url)
  }

  async logout() {
    const response = await fetch(`${envConfig.VITE_SSO_LOGOUT_API}?token=${this.getToken()}`)
    const data = await response.json()
    Reflect.set(response, 'data', data)
    httpError({ response }, true)
    if (data.code === 200) {
      this.login()
    }
  }

  getToken() {
    return Cookies.get(envConfig.VITE_SSO_TOKEN_KEY)
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  getUserData() {
    return this.userReq.getUserData()
  }
}

export const userService = new OUserService()
