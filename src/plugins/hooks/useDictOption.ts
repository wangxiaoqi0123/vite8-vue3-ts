import { useDictStore } from '/@/store'

const tagStyle = {
  padding: '0 8px',
  display: 'inline-block',
  lineHeight: '24px',
  borderRadius: '3px',
  whiteSpace: 'nowrap'
}

export default function useDictOption(dictKey) {
  const dictStore = useDictStore()
  // 全量数据
  const sourceList = computed(() => dictStore.sourceDict[dictKey] || [])
  // 启用的数据
  const enableList = computed(() => dictStore.enableDict[dictKey] || [])
  const listMap = computed(() => sourceList.value.reduce((acc, cur) => ({ ...acc, [cur.value]: cur }), {}))
  const FCTag = props => {
    const item = computed(() => listMap.value[props.value])
    if (item.value) {
      return h('span', { style: { ...tagStyle, backgroundColor: item.value.bgColor } }, item.value.label)
    } else {
      return h('span', { style: tagStyle }, '--')
    }
  }

  const label = value => listMap.value[value]?.label

  onMounted(() => {
    dictKey && dictStore.getDict(dictKey)
  })

  return {
    sourceList,
    enableList,
    listMap,
    FCTag,
    label
  }
}
