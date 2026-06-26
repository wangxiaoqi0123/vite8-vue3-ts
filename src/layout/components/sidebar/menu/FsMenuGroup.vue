<template>
  <li class="fs-menu-group">
    <div class="fs-menu-group-title" :class="[{ 'is-active': active }]" :style="liStyles" @click="onCollapse">
      <template v-if="!collapse">
        <div class="title-info">
          <i :class="`iconfont ${menu.tag}`" />
          <span :title="menu.name" class="title">{{ menu.name }}</span>
        </div>
        <i class="iconfont icon-fs_2025040929icon icon-arrow" :class="[{ 'icon-arrow-transition': show }]" />
      </template>
      <template v-else>
        <APopover placement="rightTop" overlay-class-name="fs-micro-admin-menu-popover" :align="{ offset: [10, -8] }">
          <template #content>
            <ul style="margin-bottom: 0">
              <FsMenuPopperContent :data="menu.children" :active-menu="activeMenu" />
            </ul>
          </template>
          <div class="collapse-title-info">
            <i :class="`iconfont ${menu.tag}`" />
            <span>{{ menu.name.substring(0, 2) }}</span>
          </div>
        </APopover>
      </template>
    </div>
    <template v-if="!collapse">
      <CollapseTransition>
        <ul v-show="show" class="fs-menu-group-body">
          <slot :level="level + 1" />
        </ul>
      </CollapseTransition>
    </template>
  </li>
</template>

<script setup lang="ts">
import FsMenuPopperContent from './FsMenuPopperContent.vue'

interface IFsMenuGroupProps {
  menu: any
  activeMenu: {
    ids: number[]
    origin: any[]
  }
  level?: number
  collapse: boolean
  groupClickActive?: number
}
const props = withDefaults(defineProps<IFsMenuGroupProps>(), {
  level: 0,
  collapse: false
})
const emit = defineEmits(['collapse'])
const menu = computed(() => props.menu)
const liStyles = computed(() => [{ 'padding-left': 8 + props.level * 28 + 'px' }])
const active = computed(() => props.activeMenu.ids.includes(props.menu.id))
const show = computed(() => props.groupClickActive === props.menu.id)
const onCollapse = () => {
  emit('collapse', props.menu.id)
}
</script>

<style lang="less" scoped>
.fs-menu-group {
  margin-bottom: 4px;
}
.fs-menu-group-title {
  padding: 9px 8px;
  line-height: 22px;
  cursor: pointer;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-info {
    display: flex;
    align-items: center;
    flex: 1;
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
      display: inline-block;
      width: 20px;
      height: 20px;
      color: #333;
    }
  }
  &.is-active {
    .title-info {
      .title {
        color: #378eef;
      }
      .iconfont {
        color: #378eef;
      }
    }
    .collapse-title-info {
      .iconfont {
        color: #378eef;
      }
      span {
        color: #378eef;
      }
    }
  }
  .collapse-title-info {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    .iconfont {
      font-size: 20px;
      color: #333;
    }
    span {
      font-size: 12px;
      line-height: 18px;
      color: #333;
    }
  }
}
.fs-menu-group-title:hover {
  background-color: var(--sidebar-menu-hover);
}
.is-active {
  color: #378eef;
}
.icon-arrow {
  transition: transform 0.3s;
}
.icon-arrow-transition {
  transform: rotateZ(180deg);
}
</style>
<style lang="less">
.fs-micro-admin-menu-popover {
  width: 176px;

  .fs-popover-arrow {
    visibility: hidden;
  }

  .fs-popover-inner {
    padding: 8px;
  }

  .fs-popover-inner-content {
    .fs-menu-item:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
