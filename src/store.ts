import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'

type User = components['schemas']['UserResponse']
type Camp = components['schemas']['CampResponse']

export const useUserStore = defineStore('user', () => {
  const user = ref<User>()

  const initUser = async () => {
    console.log('Hello')
    const { data, error } = await apiClient.GET('/api/me')
    if (error || !data) {
      throw Error(`ユーザー情報を取得できません: ${error}`)
    }
    console.log('Success')
    user.value = data
    return user.value
  }

  return { initUser, user }
})

export const useCampStore = defineStore('camp', () => {
  const camp = ref<Camp>()

  const initCamp = async (me: User) => {
    const camps = await apiClient.GET('/api/camps')
    if (camps.error || !camps.data) {
      throw Error(`合宿情報を取得できません: ${camps.error}`)
    }
    const latestCamp = camps.data.filter((camp) => !camp.isDraft).pop()
    if (!latestCamp) {
      throw Error(`合宿が見つかりません`)
    }

    const participants = await apiClient.GET('/api/camps/{campId}/participants', {
      params: { path: { campId: latestCamp.id } },
    })
    if (participants.error || !participants.data) {
      throw Error(`合宿情報を取得できません: ${participants.error}`)
    }
    if (participants.data.some((user) => user.id === me.id)) {
      camp.value = latestCamp
    }
  }

  return { initCamp, camp }
})
