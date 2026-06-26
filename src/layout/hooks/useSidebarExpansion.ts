import { useSystemStore } from '/@/store'

export default function useSidebarExpansion() {
  const systemStore = useSystemStore()

  const onResize = () => {
    const is = document.body.clientWidth < 1900
    if (is !== systemStore.isExpansion) systemStore.setState('isExpansion', is)
  }

  onMounted(() => {
    systemStore.setState('isExpansion', document.body.clientWidth < 1900)
    window.addEventListener('resize', onResize)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
  })
}
