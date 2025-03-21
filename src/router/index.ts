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
          path: 'personal-notes',
          name: 'ノート',
          component: () => import('@/views/PersonalNotesView.vue'),
        },
        {
          path: 'chat',
          name: 'チャット',
          component: () => import('@/views/ChatView.vue'),
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
          path: 'admin',
          children: [
            {
              path: '',
              name: '管理者ツール',
              component: () => import('@/views/admin/AdminSettings.vue'),
            },
            {
              path: 'guidebook',
              name: 'GuidebookEdit',
              component: () => import('@/views/admin/AdminGuidebookEdit.vue'),
            },
            {
              path: 'users',
              name: 'UserInformationView',
              component: () => import('@/views/admin/AdminInformationView.vue'),
            },
            {
              path: 'users/detail/:id',
              name: 'DetailPage',
              component: () => import('@/views/admin/AdminInformationDetail.vue'),
            },
            {
              path: 'users/info',
              name: 'UserInfo',
              component: () => import('@/views/admin/AdminUserView.vue'),
            },
            {
              path: 'payments',
              name: 'AdminPayments',
              component: () => import('@/views/admin/AdminPaymentsView.vue'),
            },
            {
              path: 'rooms',
              name: 'AdminRooms',
              component: () => import('@/views/admin/AdminRooms.vue'),
            },
            {
              path: 'payments/register',
              name: 'AdminPaymentRegister',
              component: () => import('@/views/admin/AdminPayments.vue'),
            },
          ],
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
