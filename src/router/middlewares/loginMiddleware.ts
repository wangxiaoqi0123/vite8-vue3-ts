import { userService } from '/@/services'

export default function loginMiddleware(_to, _from, next) {
  if (userService.isAuthenticated()) {
    next()
  } else {
    userService.login()
  }
}
