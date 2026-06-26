import { message } from 'ant-design-vue'
import { userService } from '/@/services'

enum ErrType {
  Http = 'Http',
  Response = 'Response',
  Other = 'Other'
}

const mapErrType = {
  [ErrType.Http]: '请求异常',
  [ErrType.Response]: '响应异常',
  [ErrType.Other]: '其他异常'
}

interface IErr {
  type: ErrType
  message: string
  code?: number
}

class ApiError extends Error {
  code: number
  type: ErrType
  message: string
  constructor(err: IErr) {
    super(err.message)
    this.type = err.type
    this.code = err.code
    this.message = err.message
  }
}

/**
 * 响应处理异常
 * @param responseStatusCode
 * @param result
 */
function handleResponseError(result) {
  let msg = result.response.data?.msg
  // 处理附件下载情况
  switch (result.response.data?.code) {
    case undefined:
    case 200:
      return
    case 401:
      msg = msg || '权限异常！'
      message.error(msg)
      userService.login()
      break
    default:
      break
  }
  return {
    type: ErrType.Response,
    message: msg,
    code: result.response.data?.code
  }
}

/**
 * 请求处理异常
 * @param {*} result
 */
function handleHttpError(result) {
  let msg = ''
  switch (result.response.status) {
    case 200:
      return handleResponseError(result)
    case 302:
      msg = '接口重定向了！'
      break
    case 400:
      msg = '参数不正确！'
      break
    case 401:
      msg = '权限异常！'
      break
    case 403:
      msg = '您没有权限操作！'
      break
    case 404:
      msg = `请求地址出错 ${result.response.config.url}`
      break
    case 408:
      msg = '请求超时！'
      break
    case 409:
      msg = '系统已存在相同数据！'
      break
    case 500:
      msg = '服务器内部错误！'
      break
    case 501:
      msg = '服务未实现！'
      break
    case 502:
      msg = '网关错误！'
      break
    case 503:
      msg = '服务不可用！'
      break
    case 504:
      msg = '服务暂时无法访问，请稍后再试！'
      break
    case 505:
      msg = 'HTTP版本不受支持！'
      break
    default:
      break
  }

  return {
    type: ErrType.Http,
    message: msg,
    code: result.response.status
  }
}

function handleError(showErrorMessage: boolean, err?: IErr) {
  if (!err) return
  if (showErrorMessage) {
    if (err?.code >= 1000) {
      message.warning(err.message)
    } else {
      let msg = mapErrType[err.type]
      err.code && (msg += `(${err.code})`)
      err.message ? (msg += `: ${err.message}`) : (msg += '！')
      message.error(msg)
    }
  }
  throw new ApiError(err)
}

export function httpError(result, showErrorMessage) {
  const httpStatusCode = result?.response?.status
  if (httpStatusCode) {
    const err = handleHttpError(result)
    handleError(showErrorMessage, err)
  } else {
    let message = result.message
    if (message?.includes('timeout')) message = '网络请求超时！'
    if (message?.includes('Network')) message = window.navigator.onLine ? '服务端异常！' : '您断网了！'
    const err = { type: ErrType.Other, message: message, code: null }
    handleError(showErrorMessage, err)
  }
}
