import { Modal } from 'ant-design-vue'
import { userService } from '/@/services'
import { useUserStore } from '/@/store'

/** 登陆校验限制主账号 */
const loginLimitFSAccount = userInfo => {
  if (userInfo.italentId) return true
  Modal.confirm({
    width: 600,
    centered: true,
    cancelButtonProps: <any>{ style: { display: 'none' }, disabled: true },
    content: h('div', [
      h('div', `系统检测到您当前的登录账号（${userInfo.enName}）为子账号。`),
      h('div', ['为确保后续业务流程正常使用，请使用您的飞书英文姓名全称，重新登录系统。'])
    ]),
    okText: '重新登录',
    async onOk() {
      await userService.logout()
    }
  })
  return false
}

export default async function dataMiddleware(_to, _from, next) {
  await userService.getUserData()
  const userStore = useUserStore()
  if (loginLimitFSAccount(userStore.userInfo)) {
    next()
  } else {
    return false
  }
}
