import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '../views/pages/index.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView,
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