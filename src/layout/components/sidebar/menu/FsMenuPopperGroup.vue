<template>
  <li>
    <ul ref="itemLiRef" class="fs-menu-popper-group" style="margin-bottom: 0px">
      <APopover
        placement="rightTop"
        overlay-class-name="fs-micro-admin-menu-popover"
        :align="{ offset: [0, 0] }"
        :get-popup-container="() => itemLiRef"
      >
        <div class="fs-menu-group-title" :class="[{ 'is-active': active }]">
          <div class="title-info">
            <i v-if="menu.tag" :class="`iconfont ${menu.tag}`" />
            <span>{{ menu.name }}</span>
          </div>
          <i class="iconfont icon-fs_2025040929icon1 icon-arrow" />
        </div>
        <template #content>
          <ul style="margin-bottom: 0px">
            <slot :level="level + 1" />
          </ul>
        </template>
      </APopover>
    </ul>
  </li>
</template>

<script setup lang="ts">
interface IFsMenuPopperGroup {
  menu: any
  activeMenu: {
    ids: number[]
    origin: any[]
  }
  level?: number
}
const props = withDefaults(defineProps<IFsMenuPopperGroup>(), {
  level: 0
})
const active = computed(() => props.activeMenu.ids.includes(props.menu.id))

const itemLiRef = ref()
</script>

<style lang="less" scoped>
.fs-menu-group-title {
  padding: 9px 8px;
  line-height: 22px;
  cursor: pointer;
  margin-bottom: 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;

  & > .fs-menu-group-child {
    position: absolute;
    top: 0;
    right: -172px;
    display: none;
    width: 182px;

    & > ul {
      margin-left: 20px;
      background-color: #fff;
      width: 160px;
      padding: 9px 8px;
    }
  }

  .title-info {
    display: flex;
    align-items: center;
    font-size: 14px;

    & > .iconfont {
      margin-right: 8px;
    }
  }

  .icon-arrow {
    transform: rotate(-90deg);
  }
}

.is-active {
  color: #378eef;
}

.fs-menu-group-title:hover {
  background-color: var(--sidebar-menu-hover);

  & > .fs-menu-group-child {
    display: block;
  }
}
</style>
<style>
.fs-micro-admin-menu-popover .fs-popover-inner {
  background-color: var(--sidebar-bg);
}
.fs-micro-admin-menu-popover .fs-popover-inner .fs-menu-item:hover {
  background-color: var(--sidebar-menu-hover);
}
</style>
