<template>
  <li
    class="fs-menu-item"
    :style="liStyles"
    :class="[{ 'is-active': active }, { 'is-collapse': collapse }]"
    @click="onClickMenu(menu)"
  >
    <i v-if="menu.tag" :class="`iconfont ${menu.tag}`" />
    <span :title="title" :class="[{ title: !collapse }, { 'collapse-title': collapse }]">{{ title }}</span>
  </li>
</template>

<script setup lang="ts">
interface FsMenuItem {
  menu: any
  level?: number
  collapse?: boolean
  activeMenu: {
    ids: number[]
    origin: any[]
  }
}
const props = withDefaults(defineProps<FsMenuItem>(), {
  level: 0,
  collapse: false
})
const menu = computed(() => props.menu)
const title = computed(() => (props.collapse ? props.menu.name.substring(0, 2) : props.menu.name))
const liStyles = computed(() => [{ 'padding-left': 8 + props.level * 28 + 'px' }])
const active = computed(() => props.activeMenu.ids.includes(menu.value.id))
const { push } = useRouter()
const onClickMenu = (menu: any) => {
  push(menu.pageUri)
}
</script>

<style lang="less" scoped>
.fs-menu-item {
  padding: 9px 8px;
  line-height: 22px;
  cursor: pointer;
  margin-bottom: 4px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  color: #333333;
  .title {
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-family:
      PingFangSC-Regular,
      PingFang SC;
    font-weight: 400;
    line-height: 22px;
    color: #333;
  }
  .iconfont {
    font-size: 20px;
    margin-right: 8px;
    color: #333;
  }
}
.fs-menu-item:hover {
  background-color: var(--sidebar-menu-hover);
}
.fs-menu-item.is-active {
  background-color: var(--sidebar-menu-active-bg) !important;
  color: var(--sidebar-menu-active-color);
  .iconfont {
    color: var(--sidebar-menu-active-color);
  }
  .title {
    color: var(--sidebar-menu-active-color);
  }
}
.is-collapse {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  .iconfont {
    margin-right: 0px;
  }
  .collapse-title {
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
