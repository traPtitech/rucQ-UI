import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'

type User = components['schemas']['UserResponse']

// ユーザーIDの保存

export const useUserStore = defineStore('user', () => {
  const user = ref<User | undefined>(undefined)

  const initUser = async () => {
    const { data, error } = await apiClient.GET('/api/me')
    if (error) console.error('Failed to initialize user store:', error)
    user.value = data
  }

  return { initUser, user }
})
