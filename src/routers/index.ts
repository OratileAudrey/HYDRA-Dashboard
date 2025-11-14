import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../components/dashboard/Dashboard.vue'),
  },
  {
    path: '/energyService',
    name: 'Energy Service',
    component: () => import('../services/energyService'),
  },
  {
    path: '/weatherService',
    name: 'Weather Service',
    component: () => import('../services/weatherService'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router