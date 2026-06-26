import { usePageLeave, useDocumentVisibility, useBroadcastChannel } from '@vueuse/core'
import { userService } from '/@/services'
import { Modal } from 'ant-design-vue'
import { useUserStore } from '/@/store'
import { parseJWT } from '/@/utils'

// 用户确认弹框实例
let userConfirm: any = null
// 最后一次验证时间，用于避免频繁验证
let lastValidTime = 0
// 验证间隔时间（毫秒）
const VALID_INTERVAL = 5000

// Token 验证结果枚举
enum TokenValidResult {
  VALID = 'valid',
  EXPIRED = 'expired',
  MISMATCH = 'mismatch',
  MISSING = 'missing',
  INVALID = 'invalid'
}

interface TokenValidationResult {
  result: TokenValidResult
  message?: string
}

// 创建广播频道用于跨标签页通信
const { post: broadcastReload } = useBroadcastChannel({ name: 'user-token-reload' })

function createUserTips(text: string) {
  if (userConfirm) userConfirm.destroy()
  userConfirm = Modal.confirm({
    title: '提示',
    content: text,
    okText: '确定',
    maskClosable: false,
    cancelButtonProps: { style: { display: 'none' } } as any,
    onOk: () => {
      userConfirm = null
      // 通知所有标签页刷新
      broadcastReload('reload')
      // 刷新当前页面
      window.location.reload()
    }
  })
}

/**
 * 验证 Token 的有效性
 */
function validateTokens(): TokenValidationResult {
  const userStore = useUserStore()
  const cacheToken = userStore.userInfo?.token
  const cookieToken = userService.getToken()

  // 检查 Token 是否存在
  if (!cacheToken || !cookieToken) {
    return { result: TokenValidResult.MISSING, message: '未获取到用户身份信息，请重新登录！' }
  }

  // Token 完全一致，无需进一步验证
  if (cacheToken === cookieToken) {
    return { result: TokenValidResult.VALID }
  }

  // 解析并比较 Token
  const cachePayload = parseJWT(cacheToken)?.payload
  const cookiePayload = parseJWT(cookieToken)?.payload

  if (!cachePayload || !cookiePayload) {
    throw new Error('JWT 解析异常')
  }

  // 用户 ID 不一致
  if (cachePayload.id !== cookiePayload.id) {
    return { result: TokenValidResult.MISMATCH, message: '检测到用户身份切换，请重新登录！' }
  }

  // 检查 Token 是否过期
  const currentTime = Date.now() / 1000
  if (cookiePayload.exp < currentTime) {
    return { result: TokenValidResult.EXPIRED, message: '用户身份信息已过期，请重新登录！' }
  }

  return { result: TokenValidResult.VALID }
}

export default function useValidUserToken() {
  // 监听其他标签页的刷新广播
  const { data: reloadMessage } = useBroadcastChannel({ name: 'user-token-reload' })

  function validUserToken(skipTimeCheck = false) {
    // 如果已有确认弹框，跳过验证
    if (userConfirm) return

    // 时间间隔检查，避免频繁验证（除非强制跳过）
    const currentTime = Date.now()
    if (!skipTimeCheck && currentTime - lastValidTime < VALID_INTERVAL) {
      return
    }
    lastValidTime = currentTime

    // 执行 Token 验证
    const validation = validateTokens()

    // 根据验证结果处理
    if (validation.result !== TokenValidResult.VALID && validation.message) {
      createUserTips(validation.message)
    }
  }

  const isLeft = usePageLeave()
  const visibility = useDocumentVisibility()

  // 页面离开时使用防抖验证
  watch(isLeft, left => {
    if (!left) {
      validUserToken(false)
    }
  })

  // 页面重新可见时使用节流验证，确保及时响应
  watch(visibility, (current, previous) => {
    if (current === 'visible' && previous === 'hidden') {
      validUserToken(true)
    }
  })

  // 监听其他标签页的刷新消息
  watch(reloadMessage, message => {
    if (message === 'reload') {
      window.location.reload()
    }
  })

  // 暴露手动验证方法
  return {
    validUserToken: () => validUserToken(true)
  }
}
