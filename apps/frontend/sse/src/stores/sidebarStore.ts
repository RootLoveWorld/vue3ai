import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    collapsed: false
  }),
  actions: {
    toggleSidebar() {
      this.collapsed = !this.collapsed
    },
    setCollapsed(collapsed: boolean) {
      this.collapsed = collapsed
    }
  }
})