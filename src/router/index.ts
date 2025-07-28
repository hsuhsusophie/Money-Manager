import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/pages/HomeView.vue'),
    },
    {
      path: '/home',
      name: 'home-alias',
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