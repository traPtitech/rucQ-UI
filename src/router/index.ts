import { createRouter, createWebHistory } from 'vue-router'
import { useCampStore, useTimeStore } from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/CampView.vue'),
    },
    {
      path: '/:campname/rollcall/:rollcallId',
      name: '点呼',
      component: () => import('@/views/RollCallView.vue'),
    },
    {
      path: '/:campname',
      component: () => import('@/layouts/CampLayout.vue'),
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
          component: () => import('@/views/UserInfoView.vue'),
        },
        {
          path: 'rooms',
          name: '部屋情報',
          component: () => import('@/views/RoomInfoView.vue'),
        },
        {
          path: 'activities',
          name: 'アクティビティ',
          component: () => import('@/views/ActivityView.vue'),
        },
      ],
    },
    {
      path: '/:path(.*)*',
      name: 'NotFoundView',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  try {
    const campStore = useCampStore()
    const timeStore = useTimeStore()

    // トップページの場合
    if (to.path === '/') {
      if (to.query.back === 'true') {
        next() // 明示的にトップページに戻る場合はリダイレクトしない
        return
      }

      // 公開済みの最新合宿は、参加登録の有無に関わらず終了までは直接開く
      if (!timeStore.isCampEnded(campStore.latestCamp)) {
        next(`/${campStore.latestCamp.displayId}`)
        // latestCamp が存在しない場合、campStore.latestCamp の呼び出し時点でエラーが生じ、
        // 外側の try-catch によってトップページに導かれる
        // 各コンポーネントにおける latestCamp の存在が保証され、エラーハンドリングを書く必要がなくて嬉しい
        return
      }
      next()
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
