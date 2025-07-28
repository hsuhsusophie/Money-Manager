import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/pages/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/pages/HomeView.vue'),
    },
    {
      path: '/daily-report',
      name: 'daily-report',
      component: () => import('../views/pages/DailyReportView.vue'),
    },
    {
      path: '/monthly-report',
      name: 'monthly-report',
      component: () => import('../views/pages/MonthlyReportView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/pages/MySettings.vue'),
    },
  ],
})

export default router