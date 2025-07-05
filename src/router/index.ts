import { createRouter, createWebHistory } from 'vue-router'
import { useCampStore } from '@/store'

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
          component: () => import('@/views/GuidebookView.vue'),
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

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  const { displayCamp } = useCampStore()
  const isRegistered = !!displayCamp

  if (isRegistered) {
    if (to.path === '/') {
      next(`/${displayCamp!.displayId}/info`)
      return
    }
  } else {
    if (to.path !== '/') {
      next('/')
      return
    }
  }

  next()
})

export default router
