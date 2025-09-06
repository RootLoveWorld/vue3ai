import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Sse from '../components/Sse.vue'
import Settings from '../components/Settings.vue'
import Documents from '../components/Documents.vue'
import Users from '../components/Users.vue'
import Analytics from '../components/Analytics.vue'
import Profile from '../components/Profile.vue'
import Logout from '../components/Logout.vue'
import ThemeLanguageDemo from '../components/ThemeLanguageDemo.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/sse',
    name: 'SSE',
    component: Sse
  },
  {
    path: '/documents',
    name: 'Documents',
    component: Documents
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/demo',
    name: 'Demo',
    component: ThemeLanguageDemo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router