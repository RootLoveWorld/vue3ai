<script setup lang="ts">
import { ref, computed, createVNode } from 'vue'
import { useSidebarStore } from './stores/sidebarStore'
import { useSettingsStore } from './stores/settingsStore'
import { useRouter, useRoute } from 'vue-router'
import { menuItems } from './config/menuConfig'
import { useI18n } from './composables/useI18n'
import {
  NLayout, NLayoutHeader, NLayoutSider, NLayoutContent, NLayoutFooter,
  NMenu, NButton, NIcon, NDropdown, NSpace, NAvatar
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'

// Icons for header
import { HomeOutline, ChatbubbleEllipsesOutline, SettingsOutline, 
         DocumentTextOutline, PeopleOutline, BarChartOutline,
         Moon, Sunny, Language, PersonCircle } from '@vicons/ionicons5'

const { t } = useI18n()
const sidebarStore = useSidebarStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

// Convert menu items to Naive UI menu options
const menuOptions = computed<MenuOption[]>(() => {
  const convertToMenuOptions = (items: typeof menuItems): MenuOption[] => {
    return items.map(item => {
      const option: MenuOption = {
        label: t(`header.${item.key}`) || item.label,
        key: item.key,
        icon: item.icon ? () => h(NIcon, null, { default: () => h(item.icon!) }) : undefined
      }

      console.log(item,'-----------',option)
      
      if (item.children) {
        option.children = convertToMenuOptions(item.children)
      }
      
      return option
    })
  }
  
  return convertToMenuOptions(menuItems)
})

// Computed property to determine which menu item should be active
const activeKey = computed(() => {
  const currentPath = route.path
  const activeItem = menuItems.find(item => item.path === currentPath)
  return activeItem ? activeItem.key : 'dashboard'
})

// Helper function for creating icons
const h = (component: any, props?: any, children?: any) => {
  return createVNode(component, props, children)
}

// Handle menu item click
const handleMenuSelect = (key: string) => {
  // Find the selected item in the menuItems array
  const findItem = (items: typeof menuItems): typeof menuItems[0] | undefined => {
    for (const item of items) {
      if (item.key === key) {
        return item
      }
      if (item.children) {
        const found = findItem(item.children)
        if (found) {
          return found
        }
      }
    }
  }
  
  const selectedItem = findItem(menuItems)
  if (selectedItem && selectedItem.path) {
    router.push(selectedItem.path)
  }
}

// Settings dropdown options
const settingsOptions = [
  {
    label: t('header.theme'),
    key: 'theme',
    children: settingsStore.themes.map(theme => ({
      label: t(`theme.${theme.value}`),
      key: `theme-${theme.value}`,
      props: {
        onClick: () => settingsStore.setTheme(theme.value)
      }
    }))
  },
  {
    label: t('header.language'),
    key: 'language',
    children: settingsStore.languages.map(lang => ({
      label: t(`language.${lang.value === 'zh-CN' ? 'chinese' : 'english'}`),
      key: `lang-${lang.value}`,
      props: {
        onClick: () => settingsStore.setLanguage(lang.value)
      }
    }))
  },
  {
    label: t('header.profile'),
    key: 'profile',
    props: {
      onClick: () => router.push('/profile')
    }
  },
  {
    label: t('header.logout'),
    key: 'logout',
    props: {
      onClick: () => router.push('/logout')
    }
  }
]

// Tab menu items for header
const tabMenuItems = [
  { label: t('header.dashboard'), key: 'dashboard', icon: HomeOutline },
  { label: t('header.sseChat'), key: 'sse', icon: ChatbubbleEllipsesOutline },
  { label: t('header.documents'), key: 'documents', icon: DocumentTextOutline }
]

const activeTab = ref('dashboard')

const handleTabSelect = (key: string) => {
  activeTab.value = key
  // Find the selected item in the menuItems array
  const findItem = (items: typeof menuItems): typeof menuItems[0] | undefined => {
    for (const item of items) {
      if (item.key === key) {
        return item
      }
      if (item.children) {
        const found = findItem(item.children)
        if (found) {
          return found
        }
      }
    }
  }
  
  const selectedItem = findItem(menuItems)
  if (selectedItem && selectedItem.path) {
    router.push(selectedItem.path)
  }
}
</script>

<template>
  <n-layout class="app-layout" style="height: 100vh; width: 100%;">
    <!-- Header -->
    <n-layout-header bordered style="height: 64px; padding: 0 16px;">
      <div class="flex items-center justify-between h-full">
        <div class="flex items-center">
          <n-button @click="sidebarStore.toggleSidebar()" quaternary circle>
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </n-icon>
            </template>
          </n-button>
          
          <!-- Tab Menu -->
          <n-space align="center" style="margin-left: 20px;">
            <n-button 
              v-for="tab in tabMenuItems" 
              :key="tab.key"
              :type="activeTab === tab.key ? 'primary' : 'default'"
              quaternary
              @click="handleTabSelect(tab.key)"
            >
        
              <template #icon>
                <n-icon :component="tab.icon" />
              </template>
              {{ tab.label }}
            </n-button>
          </n-space>
        </div>
        
        <div class="flex items-center">
          <!-- Theme Toggle -->
          <n-button quaternary circle @click="settingsStore.setTheme(settingsStore.theme === 'dark' ? 'light' : 'dark')">
            <template #icon>
              <n-icon>
                <Moon v-if="settingsStore.theme === 'light'" />
                <Sunny v-else />
              </n-icon>
            </template>
          </n-button>
          
          <!-- Language Selector -->
          <n-button quaternary circle>
            <template #icon>
              <n-icon>
                <Language />
              </n-icon>
            </template>
          </n-button>
          
          <!-- Settings Dropdown -->
          <n-dropdown trigger="hover" :options="settingsOptions" placement="bottom-end">
            <n-button quaternary circle>
              <template #icon>
                <n-icon>
                  <SettingsOutline />
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
          
          <!-- User Avatar -->
          <n-avatar round size="small" style="margin-left: 12px;">
            <n-icon>
              <PersonCircle />
            </n-icon>
          </n-avatar>
        </div>
      </div>
    </n-layout-header>

    <n-layout has-sider position="absolute" style="top: 64px; height: calc(100vh - 64px);">
      <!-- Sidebar -->
      <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed="sidebarStore.collapsed"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
      >
        <div class="p-2">
          <n-menu
            :value="activeKey"
            :collapsed="sidebarStore.collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            @update:value="handleMenuSelect"
          />
        </div>
      </n-layout-sider>

      <!-- Content Area -->
      <n-layout style="height: 100%;">
        <n-layout-content
          :native-scrollbar="false"
          content-style="padding: 24px; height: calc(100% - 44px);"
        >
          <router-view />
        </n-layout-content>

        <n-layout-footer bordered position="absolute" style="height: 44px;">
          <div style="padding: 12px; text-align: center;">
            {{ t('footer.text') }}
          </div>
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.h-full {
  height: 100%;
}

.p-2 {
  padding: 0.5rem;
}

.ml-4 {
  margin-left: 1rem;
}

.text-xl {
  font-size: 1.25rem;
}

.font-bold {
  font-weight: bold;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}
</style>