import { defineStore } from 'pinia'
import { getDictionaryOption } from '/@/api/dictionary'
import { memoAsync } from '/@/utils'
import { dictOptionStatus } from '/@/enums'

export const getEnableDict = data => {
  if (!Array.isArray(data)) return data
  return data.reduce((total, cur) => {
    // 过滤废弃字段
    if (cur?.status === dictOptionStatus.DEPRECATED) return total
    if (Array.isArray(cur?.options) && cur.options.length) {
      total.push({ ...cur, options: getEnableDict(cur.options) })
    } else {
      total.push(cur)
    }
    return total
  }, [])
}

export const useDictStore = defineStore('dict', {
  state: () => ({
    sourceDict: {},
    enableDict: {}
  }),

  getters: {},
  actions: {
    getDict: memoAsync(async function (sourceKey) {
      if (this.sourceDict[sourceKey]?.length) return this.sourceDict[sourceKey]
      const data = await getDictionaryOption({ sourceKey, status: 1 })
      this.sourceDict[sourceKey] = JSON.parse(data)
      this.enableDict[sourceKey] = getEnableDict(JSON.parse(data))
      return this.sourceDict[sourceKey]
    })
  }
})
