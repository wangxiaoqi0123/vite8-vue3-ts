<template>
  <AConfigProvider
    :theme="theme"
    :locale="locale"
    :prefix-cls="prefixCls"
    :auto-insert-space-in-button="autoInsertSpaceInButton"
    :render-empty="empty"
    :get-target-container="getTargetContainer"
  >
    <template v-for="name in Object.keys($slots)" :key="name" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </AConfigProvider>
</template>

<script lang="ts" setup>
import AEmpty from 'ant-design-vue/es/empty'
import emptyImg from '/@/assets/images/empty.png'
import { theme, locale, prefixCls, autoInsertSpaceInButton } from '/@/styles/ant-design/theme'
const empty = () => h(AEmpty, { image: emptyImg, class: 'fs-custom-global-empty' })
const getTargetContainer = () => document.querySelector('main.main-content') as HTMLElement
</script>

<style lang="less">
.fs-custom-global-empty {
  .fs-empty-image {
    display: flex;
    justify-content: center;
    height: 50px;
    margin-bottom: 0px;
  }

  .fs-empty-description {
    margin: 0;
    margin-top: 8px;
  }
}
</style>
