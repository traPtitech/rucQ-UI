import { createRouter, createWebHistory } from 'vue-router'
import { useCampStore, useTimeStore } from '@/store'
import { storeToRefs } from 'pinia'

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
    const campStore = useCampStore()
    const timeStore = useTimeStore()
    const { hasRegisteredLatest } = storeToRefs(campStore)

    // トップページの場合
    if (to.path === '/') {
      if (to.query.back === 'true') {
        next() // 明示的にトップページに戻る場合はリダイレクトしない
        return
      }

      if (hasRegisteredLatest.value) {
        next(`/${campStore.latestCamp.displayId}`)
        // 登録済みの場合は最新合宿のページにリダイレクト
        // latestCamp が存在しない場合、campStore.latestCamp の呼び出し時点でエラーが生じ、
        // 外側の try-catch によってトップページに導かれる
        // 各コンポーネントにおける latestCamp の存在が保証され、エラーハンドリングを書く必要がなくて嬉しい
        return
      }
      next()
      return
    }

    // 合宿固有のページの場合
    if (to.params.campname as string) {
      const targetCamp = campStore.getCampByDisplayId(to.params.campname as string)
      // to.params.campname に基づいて合宿を探しても見つからない場合には getCampByDisplayId はエラーを生じ、
      // 外側の try-catch によってトップページに導かれる
      if (hasRegisteredLatest.value || timeStore.isCampEnded(targetCamp)) {
        next()
        return
      }
      next('/') // 表示不可能な場合はトップページにリダイレクト
      return
    }

    next()
    return
  } catch (error) {
    console.error(error)
    if (to.path !== '/') next('/')
    return
  }
})

// ナビゲーション完了後に URL を綺麗にする
router.afterEach((to) => {
  // トップページで back=true クエリパラメータがある場合、URL を綺麗にする
  if (to.path === '/' && to.query.back === 'true') {
    window.history.replaceState({}, '', '/')
  }
})

export default router
