import { computed } from 'vue'
import { useGetMe } from '@/api/generated/client'

export const useCurrentUser = () => {
  const { data } = useGetMe()
  const user = computed(() => {
    if (!data.value) throw new Error('ユーザー情報が初期化されていません')
    return data.value
  })
  return { user }
}
