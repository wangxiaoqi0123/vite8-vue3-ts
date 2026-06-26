import { createEnum } from '../plugins'

/**
 * 接口响应状态
 */
export const responseStatus = createEnum({
  WARNING_MESSING: [1000, '消息警告提醒'],
  NODE_HAS_COMPLETE: [1012, '该操作已完成，无法继续操作!'],
  ITEM_DELETED: [1006, '该详情已被删除，无法查看详情']
} as const)

export const dictOptionStatus = createEnum({
  DEPRECATED: ['deprecated', '废弃']
} as const)
