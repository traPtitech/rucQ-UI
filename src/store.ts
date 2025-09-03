import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import { queryClient } from '@/lib/queryClient'
import { qk } from '@/api/queries/keys'

type User = components['schemas']['UserResponse']
type Camp = components['schemas']['CampResponse']

export const useUserStore = defineStore('user', () => {
  const user = ref<User>()

  const initUser = async () => {
    const data = await queryClient.ensureQueryData({
      queryKey: qk.me.all,
      queryFn: async () => {
        const { data, error } = await apiClient.GET('/api/me')
        if (error || !data) {
          throw new Error(`ユーザー情報を取得できません: ${error}`)
        }
        return data
      },
      staleTime: Infinity,
      gcTime: Infinity,
    })
    user.value = data
  }

  return {
    initUser,
    user: computed(() => {
      if (!user.value) {
        throw new Error('ユーザー情報が初期化されていません')
      }
      return user.value
    }),
  }
})

export const useCampStore = defineStore('camp', () => {
  const latestCamp = ref<Camp>()
  const allCamps = ref<Camp[]>([])
  const hasRegisteredLatest = ref(false) // 最新の合宿に参加登録済みかどうか

  const initCamp = async (me: User) => {
    const camps = await queryClient.ensureQueryData<Camp[]>({
      queryKey: qk.camps.lists(),
      queryFn: async () => {
        const { data, error } = await apiClient.GET('/api/camps')
        if (error || !data) {
          throw new Error(`合宿情報を取得できません: ${error}`)
        }
        return data
          .filter((camp) => !camp.isDraft)
          .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())
      },
    })

    // index が小さいほど新しい合宿
    allCamps.value = camps

    latestCamp.value = allCamps.value[0]
    if (!latestCamp.value) {
      return
    }

    const participants = await queryClient.ensureQueryData<components['schemas']['UserResponse'][]>(
      {
        queryKey: qk.camps.participants(latestCamp.value.id),
        queryFn: async () => {
          const { data, error } = await apiClient.GET('/api/camps/{campId}/participants', {
            params: { path: { campId: latestCamp.value!.id } },
          })
          if (error || !data) {
            throw new Error(`合宿参加者情報を取得できません: ${error}`)
          }
          return data
        },
      },
    )
    hasRegisteredLatest.value = participants.some((user) => user.id === me.id)
  }

  // パスパラメータから合宿を取得する関数
  const getCampByDisplayId = (displayId: string) => {
    const camp = allCamps.value.find((camp) => camp.displayId === displayId)
    if (!camp) {
      throw new Error(`合宿が見つかりません: ${displayId}`)
    }
    return camp
  }

  const register = async (campId: number) => {
    const { error } = await apiClient.POST('/api/camps/{campId}/register', {
      params: { path: { campId: campId } },
    })
    if (error) throw error
    hasRegisteredLatest.value = true
  }

  const unregister = async (campId: number) => {
    const { error } = await apiClient.DELETE('/api/camps/{campId}/register', {
      params: { path: { campId } },
    })
    if (error) throw error
    hasRegisteredLatest.value = false
  }

  // 指定した合宿がユーザーにとって操作可能かどうかを判定
  // ・ユーザーがその合宿に参加している
  // ・合宿が終了していない
  const timeStore = useTimeStore()

  const isOperable = (camp: Camp) => {
    // 最新の合宿かつ登録済みで、かつ終了していない場合のみ操作可能
    if (!latestCamp.value || latestCamp.value.id !== camp.id) return false
    return hasRegisteredLatest.value && !timeStore.isCampEnded(camp)
  }

  return {
    initCamp,
    getCampByDisplayId,
    latestCamp: computed(() => {
      // latestCamp が初期化されていない場合、外から latestCamp を呼び出した瞬間にエラーが生じる
      if (!latestCamp.value) {
        throw new Error('最新の合宿情報が初期化されていません')
      }
      return latestCamp.value
    }),
    allCamps: computed(() => allCamps.value),
    hasRegisteredLatest,
    register,
    unregister,
    isOperable,
  }
})

export const useTimeStore = defineStore('time', () => {
  const currentTime = ref(new Date())

  const updateTime = () => {
    currentTime.value = new Date()
    requestAnimationFrame(updateTime)
  }

  updateTime() // 呼び出されて即座に現在時刻の更新を開始

  const isCampEnded = (camp: Camp) => {
    // すでに終わっている → 閲覧可能
    const endDate = new Date(camp.dateEnd)
    endDate.setDate(endDate.getDate() + 1)
    return currentTime.value > endDate
  }

  return {
    currentTime: computed(() => currentTime.value),
    isCampEnded,
  }
})
