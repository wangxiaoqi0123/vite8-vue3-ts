import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', {
  state: () => ({
    isExpansion: true
  }),

  getters: {},

  actions: {
    setState(key: 'isExpansion', value) {
      this[key] = value
    }
  }
})
