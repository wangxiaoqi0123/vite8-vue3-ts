<template>
  <ul class="fs-menu-container" :style="styleMenuContainer">
    <FsMenuContent :data="menus" :active-menu="activeMenu" :collapse="collapse" />
  </ul>
</template>
<script setup lang="ts">
import FsMenuContent from './FsMenuContent.vue'
export interface IFsMenuProps {
  activeUri: string
  menus: any[]
  collapse?: boolean
  width?: number
  collapseWidth?: number
}
const props = withDefaults(defineProps<IFsMenuProps>(), {
  activeUri: '',
  menus: () => [],
  collapse: false,
  width: 224,
  collapseWidth: 72
})

const styleMenuContainer = computed(() => [
  {
    padding: ` 0 ${props.collapse ? 4 : 16}px`
  },
  {
    width: `${props.collapse ? props.collapseWidth : props.width}px`
  }
])

const menuMap = computed(() => {
  return (props.menus || []).reduce((map, cur) => {
    function pageUriMap(item, ids = []) {
      const curIds = [...ids]
      curIds.push(item.id)
      if (item.pageUri) {
        map[item.pageUri] = { ids: curIds, origin: item }
      }
      if (item.children?.length) {
        for (let i = 0; i < item.children.length; i++) {
          const childItem = item.children[i]
          pageUriMap(childItem, curIds)
        }
      }
    }
    pageUriMap(cur, [])
    return map
  }, {})
})

const activeMenu = computed(() => {
  const menu = menuMap.value[props.activeUri]
  return menu?.ids?.length ? menu : { ids: [] }
})
</script>
<style lang="less" scoped>
.fs-menu-container {
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.1s ease;
}
</style>
