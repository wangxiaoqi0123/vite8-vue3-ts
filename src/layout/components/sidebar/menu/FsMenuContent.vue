<template>
  <template v-for="item in props.data" :key="item.name">
    <FsMenuGroup
      v-if="item?.children?.length"
      :level="level"
      :index="item.name"
      :menu="item"
      :active-menu="activeMenu"
      :collapse="collapse"
      :group-click-active="groupClickActive"
      @collapse="onMenuCollapse"
    >
      <template #default="slotScope">
        <FsMenuContent :data="item.children" :active-menu="activeMenu" :level="slotScope.level" :collapse="collapse" />
      </template>
    </FsMenuGroup>
    <FsMenuItem v-else :menu="item" :active-menu="activeMenu" :level="level" :collapse="collapse" />
  </template>
</template>

<script setup lang="ts">
import FsMenuGroup from './FsMenuGroup.vue'
import FsMenuItem from './FsMenuItem.vue'

interface IFsMenuContentProps {
  data: any[]
  level?: number
  collapse: boolean
  activeMenu: {
    ids: number[]
    origin: any[]
  }
}

const props = withDefaults(defineProps<IFsMenuContentProps>(), {
  data: () => [],
  level: 0,
  collapse: false
})

const groupClickActive = ref()
const onMenuCollapse = (id, collapse) => {
  if (groupClickActive.value === id || collapse) {
    groupClickActive.value = -1
  } else {
    groupClickActive.value = id
  }
}
</script>
