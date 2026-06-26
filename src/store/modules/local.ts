import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

const defaultState = {}

type State = typeof defaultState

export const useLocalStore = defineStore('local', () => {
  const storageKey = computed(() => `project_local_state`)
  const state = useStorage(storageKey, defaultState)

  function setState<K extends keyof State>(key: K, value: State[K]) {
    state.value[key] = value
  }

  return {
    ...toRefs(readonly(state.value)),
    setState
  }
})

export function useStoreRef<K extends keyof State>(key: K) {
  const store = useLocalStore()
  return computed({
    get: () => store[key],
    set: value => store.setState(key, value)
  })
}
