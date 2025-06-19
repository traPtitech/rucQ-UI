import { createRouter, createWebHistory } from 'vue-router'
import { apiClient } from '@/api/apiClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/RegistrationView.vue'),
      meta: { showLayout: false },
    },
    {
      path: '/:campname',
      children: [
        {
          path: '',
          name: '合宿のしおり',
          component: () => import('@/views/WorkInProgressView.vue'),
          meta: { showLayout: true },
        },
        {
          path: 'schedule',
          name: 'スケジュール',
          component: () => import('@/views/WorkInProgressView.vue'),
          meta: { showLayout: true },
        },
        {
          path: 'info',
          name: 'ユーザー情報',
          component: () => import('@/views/UserInfoView.vue'),
          meta: { showLayout: true },
        },
        {
          path: 'rooms',
          name: '部屋情報',
          component: () => import('@/views/WorkInProgressView.vue'),
          meta: { showLayout: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFoundView',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { showLayout: false },
    },
  ],
})

export default router
