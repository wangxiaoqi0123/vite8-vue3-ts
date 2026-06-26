import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export const locale = zhCN

export const prefixCls = 'fs'

export const theme = {
  token: {
    fontSize: 12,
    borderRadius: 3,
    wireframe: true,
    // 主题色
    colorPrimary: '#378eef',
    colorPrimaryActive: '#2c71bf',
    colorPrimaryHover: '#378eef',
    // 警告色
    colorError: '#f04141',
    colorErrorActive: '#c03434',
    colorErrorHover: '#fc716d',
    colorSuccess: '#2fcc83',
    colorWarning: '#fa8f23',
    colorInfo: '#378eef'
  }
}

export const autoInsertSpaceInButton = false
