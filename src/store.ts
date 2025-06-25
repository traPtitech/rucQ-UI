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
    if (error) throw error
    user.value = data
  }

  return { initUser, user }
})

export const useCampStore = defineStore('camp', () => {
  const camp = ref<Camp>()

  const initCamp = async () => {
    const { data, error } = await apiClient.GET('/api/camps')
    if (error || !data) throw error
    camp.value = data[data.length - 1]
  }

  return { initCamp, camp }
})
