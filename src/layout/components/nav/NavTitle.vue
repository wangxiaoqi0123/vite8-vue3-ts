<template>
  <ul class="nav-box">
    <template v-if="meta.navs?.length">
      <li v-for="(item, index) in meta.navs" :key="index" class="parent-nav" @click="onJump(item)">
        <span :class="[{ 'cursor-pointer hover-c-#5FA4F2': item.path }]">
          {{ item.name }}
        </span>
        <span class="split">/</span>
      </li>
    </template>
    <li class="last-nav">{{ meta?.title }}</li>
  </ul>
</template>

<script setup lang="ts">
import type { FRouteMeta } from '/@/types/router'

const router = useRouter()
const meta = computed<FRouteMeta>(() => router.currentRoute.value?.meta || {})

const onJump = (item: any) => {
  if (item.path) {
    router.replace(item.path)
    return
  }
}
</script>

<style scoped lang="less">
.nav-box {
  display: flex;
  font-size: 12px;
  .parent-nav {
    font-weight: 400;
    color: #999999;
  }
  .split {
    margin: 0px 8px;
  }
  .last-nav {
    font-weight: 500;
    color: #666666;
  }
}
</style>
