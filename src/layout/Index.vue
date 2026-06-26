<template>
  <AWatermark
    class="watermark-wrap"
    :content="watermarkText"
    :font="{ color: 'rgba(0,0,0,0.05)', fontSize: 14 }"
    :z-index="10000"
  >
    <div class="layout-container">
      <Sidebar v-if="!currentRoute?.meta?.hideLayout" />
      <div class="layout-content">
        <Header v-if="!currentRoute?.meta?.hideLayout" />

        <main class="main-content">
          <Nav v-if="!(currentRoute?.meta?.hideLayout || currentRoute?.meta?.hideNav)" />
          <div class="content" :style="currentRoute?.meta?.contentStyle">
            <RouterView v-slot="{ Component }">
              <KeepAlive>
                <component
                  :is="Component"
                  v-if="currentRoute.meta.keepAlive"
                  :key="currentRoute.meta?.pageKey?.(currentRoute)"
                />
              </KeepAlive>
              <component
                :is="Component"
                v-if="!currentRoute.meta.keepAlive"
                :key="currentRoute.meta?.pageKey?.(currentRoute)"
              />
            </RouterView>
          </div>
        </main>
      </div>
    </div>
  </AWatermark>
</template>

<script setup>
import Header from './components/header/Index.vue'
import Nav from './components/nav/Index.vue'
import Sidebar from './components/sidebar/Index.vue'
import { useUserStore } from '/@/store'
import useValidUserToken from './hooks/useValidUserToken'
useValidUserToken()

const { currentRoute } = useRouter()
const userStore = useUserStore()

const watermarkText = computed(() => {
  const name = userStore.userInfo?.cnName || ''
  const jobNo = userStore.userInfo?.fsNo || ''
  return [name, jobNo].filter(Boolean).join(' ')
})

const layoutStyle = {
  '--sidebar-bg': '#eff4ff',
  '--sidebar-menu-hover': '#E0EAFF',
  '--sidebar-menu-active-bg': '#fff',
  '--sidebar-menu-active-color': '#378EEF',
  '--main-bg': '#fff'
}

Object.entries(layoutStyle).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value)
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  min-width: 1274px;
  width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
}

.layout-content {
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  background: linear-gradient(90deg, #f4f8ff 0%, #e8f2ff 47%, #f0f8ff 99%, #eff4ff 99%);
  overflow-y: auto;
}
.content {
  padding: 20px;
}

.watermark-wrap {
  display: flex;
  flex: 1;
  min-height: 0;
}
</style>
