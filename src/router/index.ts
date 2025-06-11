import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/RootView.vue'),
    },
    {
      path: '/camps',
      name: '合宿一覧',
      component: () => import('@/views/CampSelectView.vue'),
    },
    {
      path: '/:campname',
      children: [
        {
          path: '',
          name: '合宿のしおり',
          component: () => import('@/views/GuidebookView.vue'),
        },
        {
          path: 'schedule',
          name: 'スケジュール',
          component: () => import('@/views/ScheduleView.vue'),
        },
        {
          path: 'info',
          name: 'ユーザー情報',
          component: () => import('@/views/UserInformationView.vue'),
        },
        {
          path: 'info/users',
          name: '部屋情報',
          component: () => import('@/views/UserRoomInformationView.vue'),
        },
        {
          path: '/:path(.*)*',
          name: 'NotFoundView',
          component: () => import('@/views/NotFoundView.vue'),
        },
      ],
    },
  ],
})

export default router
