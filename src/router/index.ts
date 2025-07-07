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
  try {
    const { latestCamp, hasRegisteredLatest, getCampByDisplayId } = useCampStore()

    // トップページの場合
    if (to.path === '/') {
      if (hasRegisteredLatest) {
        // 登録済みの場合は最新合宿のページにリダイレクト
        next(`/${latestCamp.displayId}`)
      }
      next()
      return
    }

    // 合宿固有のページの場合
    const campname = to.params.campname as string
    if (campname) {
      try {
        getCampByDisplayId(campname)
      } catch {
        // 合宿が見つからない場合は404へリダイレクト
        next('/')
        return
      }
    }

    next()
  } catch (error) {
    console.error(error)
    next('/') // エラーが発生した場合は404へリダイレクト})
  }
})

export default router
