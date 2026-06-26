<template>
  <ConfigProvider>
    <RouterView />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { useSidebarExpansion } from './layout'
useSidebarExpansion()
</script>

<style scoped></style>
