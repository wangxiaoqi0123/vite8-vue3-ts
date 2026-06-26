<template>
  <ALayoutSider class="fs-layout-sider" :width="systemStore.isExpansion ? '72px' : '224px'">
    <div class="home-logo-box">
      <a :class="['home-logo', { expansion: systemStore.isExpansion }]" />
      <span class="title">项目管理系统</span>
    </div>

    <div class="menu-box">
      <FsMenu :active-uri="activeUri" :menus="userStore.menus" :collapse="systemStore.isExpansion" />
    </div>
  </ALayoutSider>
</template>

<script setup lang="ts">
import FsMenu from './menu/FsMenu.vue'
import { useSystemStore, useUserStore } from '/@/store'

const systemStore = useSystemStore()
const userStore = useUserStore()
const { currentRoute } = useRouter()

const activeUri = computed(() => {
  const path = currentRoute.value.path
  const parentPath = (currentRoute.value.meta?.navs as any[])?.slice(-1)[0]?.path
  return parentPath || path
})
</script>

<style scoped lang="less">
.fs-layout-sider {
  box-shadow: 2px 0px 8px 0px rgb(88 98 110 / 8%);
  background-color: var(--sidebar-bg);
  transition: all 0.1s ease;
  z-index: 101;
}
.home-logo-box {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 22px;
  height: 56px;
  box-shadow: 0px 1px 1px 0 rgb(88 98 110 / 8%);
  margin-bottom: 8px;
  overflow: hidden;
  .home-logo {
    position: absolute;
    top: 50%;
    left: 22px;
    transform: translateY(-50%);
    z-index: 9;
    width: 51px;
    height: 25px;
    background: url('../../../assets/images/logo.svg');
    background-size: cover;
  }
  .expansion {
    width: 28px;
  }
  .title {
    position: absolute;
    top: 50%;
    left: 80px;
    transform: translateY(-50%);
    white-space: nowrap;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }
}
.menu-box {
  height: calc(100vh - 68px);
  overflow-y: auto;
  overflow-x: hidden;
}
.menu-box::-webkit-scrollbar {
  display: none;
}
.menu-box:hover::-webkit-scrollbar {
  display: block;
}
</style>
