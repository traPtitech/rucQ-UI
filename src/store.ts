import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'

type User = components['schemas']['UserResponse']
type Camp = components['schemas']['CampResponse']

export const useUserStore = defineStore('user', () => {
  const user = ref<User>()

  const initUser = async () => {
    const { data, error } = await apiClient.GET('/api/me')
    if (error || !data) {
      throw new Error(`ユーザー情報を取得できません: ${error}`)
    }
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
    const camps = await apiClient.GET('/api/camps')
    if (camps.error || !camps.data) {
      throw new Error(`合宿情報を取得できません: ${camps.error}`)
    }

    // index が小さいほど新しい合宿
    allCamps.value = camps.data
      .filter((camp) => !camp.isDraft)
      .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())

    latestCamp.value = allCamps.value[0]
    if (!latestCamp.value) {
      return
    }

    const participants = await apiClient.GET('/api/camps/{campId}/participants', {
      params: { path: { campId: latestCamp.value.id } },
    })
    if (participants.error || !participants.data) {
      throw new Error(`合宿参加者情報を取得できません: ${participants.error}`)
    }
    hasRegisteredLatest.value = participants.data.some((user) => user.id === me.id)
  }

  // パスパラメータから合宿を取得する関数
  const getCampByDisplayId = (displayId: string) => {
    const camp = allCamps.value.find((camp) => camp.displayId === displayId)
    if (!camp) {
      throw new Error(`合宿が見つかりません: ${displayId}`)
    }
    return camp
  }

  const register = async () => {
    if (!latestCamp.value) return
    const { error } = await apiClient.POST('/api/camps/{campId}/register', {
      params: { path: { campId: latestCamp.value.id } },
    })
    if (error) throw error
    hasRegisteredLatest.value = true
  }

  const cancelRegistration = async (campId: number) => {
    const { error } = await apiClient.DELETE('/api/camps/{campId}/register', {
      params: { path: { campId } },
    })
    if (error) throw error
    hasRegisteredLatest.value = false
  }

  return {
    initCamp,
    getCampByDisplayId,
    latestCamp: computed(() => {
      if (!latestCamp.value) {
        throw new Error('最新の合宿情報が初期化されていません')
      }
      return latestCamp.value
    }),
    allCamps: computed(() => allCamps.value),
    hasRegisteredLatest,
    register,
    cancelRegistration,
  }
})

export const useTimeStore = defineStore('time', () => {
  const currentTime = ref(new Date())

  const updateTime = () => {
    currentTime.value = new Date()
    requestAnimationFrame(updateTime)
  }

  updateTime() // 呼び出されて即座に現在時刻の更新を開始

  return { currentTime: computed(() => currentTime.value) }
})
