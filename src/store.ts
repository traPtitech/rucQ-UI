import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'

type User = components['schemas']['UserResponse']
type Camp = components['schemas']['CampResponse']

export const useUserStore = defineStore('user', () => {
  const user = ref<User>()

  const initUser = async () => {
    const { data, error } = await apiClient.GET('/api/me')
    if (error || !data) {
      throw Error(`ユーザー情報を取得できません: ${error}`)
    }
    user.value = data
    return user.value
  }

  return { initUser, user }
})

export const useCampStore = defineStore('camp', () => {
  const displayCamp = ref<Camp>()
  const latestCamp = ref<Camp>()
  const allCamps = ref<Camp[]>([])
  const hasRegisteredLatest = ref(false) // 最新の合宿に参加登録済みかどうか

  const initCamp = async (me: User) => {
    const camps = await apiClient.GET('/api/camps')
    if (camps.error || !camps.data) {
      throw Error(`合宿情報を取得できません: ${camps.error}`)
    }

    // インデックスが小さいほど新しい合宿
    allCamps.value = camps.data
      .filter((camp) => !camp.isDraft)
      .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())

    latestCamp.value = allCamps.value[0]
    if (!latestCamp.value) {
      throw Error(`合宿が見つかりません`)
    }

    const participants = await apiClient.GET('/api/camps/{campId}/participants', {
      params: { path: { campId: latestCamp.value.id } },
    })
    if (participants.error || !participants.data) {
      throw Error(`合宿情報を取得できません: ${participants.error}`)
    }
    if (participants.data.some((user) => user.id === me.id)) {
      displayCamp.value = latestCamp.value
      hasRegisteredLatest.value = true
    }
  }

  return { initCamp, displayCamp, latestCamp, allCamps, hasRegisteredLatest }
})

export const useTimeStore = defineStore('time', () => {
  const currentTime = ref(new Date())

  const updateTime = () => {
    currentTime.value = new Date()
    requestAnimationFrame(updateTime)
  }

  updateTime() // 呼び出されて即座に現在時刻の更新を開始

  return { currentTime }
})
