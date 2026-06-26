<template>
  <template v-for="item in props.data" :key="item.id">
    <FsMenuPopperGroup
      v-if="item?.children?.length"
      :active-menu="activeMenu"
      :level="level"
      :index="item.id"
      :menu="item"
    >
      <template #default="slotScope">
        <FsMenuPopperContent :data="item.children" :active-menu="activeMenu" :level="slotScope.level" />
      </template>
    </FsMenuPopperGroup>
    <FsMenuItem v-else :menu="item" :active-menu="activeMenu" />
  </template>
</template>

<script setup lang="ts">
import FsMenuItem from './FsMenuItem.vue'
import FsMenuPopperGroup from './FsMenuPopperGroup.vue'

interface IFsMenuPopperContent {
  data: any[]
  activeMenu: {
    ids: number[]
    origin: any[]
  }
  level?: number
}
const props = withDefaults(defineProps<IFsMenuPopperContent>(), {
  data: () => [],
  level: 0
})
</script>
