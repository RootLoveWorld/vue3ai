import { HomeOutline, ChatbubbleEllipsesOutline, SettingsOutline, 
         DocumentTextOutline, PeopleOutline, BarChartOutline,
         PersonCircle, LogOut, ColorPaletteOutline } from '@vicons/ionicons5'
import type { Component } from 'vue'

export interface MenuItem {
  label: string
  key: string
  icon?: Component
  path?: string
  children?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: HomeOutline,
    path: '/dashboard'
  },
  {
    label: 'SSE Chat',
    key: 'sseChat',
    icon: ChatbubbleEllipsesOutline,
    path: '/sse'
  },
  {
    label: 'Documents',
    key: 'documents',
    icon: DocumentTextOutline,
    path: '/documents'
  },
  {
    label: 'Users',
    key: 'users',
    icon: PeopleOutline,
    path: '/users'
  },
  {
    label: 'Analytics',
    key: 'analytics',
    icon: BarChartOutline,
    path: '/analytics'
  },
  {
    label: 'Demo',
    key: 'demo',
    icon: ColorPaletteOutline,
    path: '/demo'
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: SettingsOutline,
    children: [
      {
        label: 'Profile',
        key: 'profile',
        icon: PersonCircle,
        path: '/profile'
      },
      {
        label: 'Logout',
        key: 'logout',
        icon: LogOut,
        path: '/logout'
      }
    ]
  }
]