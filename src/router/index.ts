import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/RootView.vue'),
      meta: { showLayout: false },
    },
    {
      path: '/:campname',
      children: [
        {
          path: '',
          name: '合宿のしおり',
          component: () => import('@/views/GuidebookView.vue'),
          meta: { showLayout: true },
        },
        {
          path: 'schedule',
          name: 'スケジュール',
          component: () => import('@/views/ScheduleView.vue'),
          meta: { showLayout: true },
        },
        {
          path: 'info',
          name: 'ユーザー情報',
          component: () => import('@/views/UserInformationView.vue'),
          meta: { showLayout: true },
        },
        {
          path: 'info/users',
          name: '部屋情報',
          component: () => import('@/views/UserRoomInformationView.vue'),
          meta: { showLayout: true },
        },
        {
          path: '/:path(.*)*',
          name: 'NotFoundView',
          component: () => import('@/views/NotFoundView.vue'),
          meta: { showLayout: false },
        },
      ],
    },
  ],
})

export default router
