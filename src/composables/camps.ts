import {
  useGetCamps,
  useGetCampParticipants,
  getGetCampsQueryKey,
  postCampRegister,
  deleteCampRegister,
  getGetCampParticipantsQueryKey,
} from '@/api/generated/client'
import type { CampResponse as Camp, UserResponse as User } from '@/api/generated/client.schemas'
import { queryClient } from '@/api/queryClient'
import { computed, ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useCurrentUser } from './useCurrentUser'
import { useTime } from './useTime'

const hasRegisteredLatest = ref<boolean>() // 最新の合宿に参加登録済みかどうか

/** 公開済みの合宿を時刻でソートして返す */
export const publishedCamps = (camps: Camp[]) =>
  camps
    .filter((camp) => !camp.isDraft)
    .sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())

export const getLatestCamp = (camps: Camp[]) => publishedCamps(camps).at(0)

export const isCampEnded = (camp: Camp, now = new Date()) => {
  // すでに終わっている → 閲覧可能
  const endDate = new Date(camp.dateEnd)
  endDate.setDate(endDate.getDate() + 1)
  return now > endDate
}

export const getCachedLatestCamp = () =>
  getLatestCamp(queryClient.getQueryData<Camp[]>(getGetCampsQueryKey()) ?? [])

export const useCamps = () => {
  const { data: camps } = useGetCamps()
  const { user } = useCurrentUser()
  const { currentTime } = useTime()
  const isCampEndedNow = (camp: Camp) => isCampEnded(camp, currentTime.value)
  const allCamps = computed(() => publishedCamps(camps.value ?? []))
  const latestPublishedCamp = computed(() => getLatestCamp(camps.value ?? []))
  const latestCamp = computed(() => {
    // latestCamp が初期化されていない場合、外から latestCamp を呼び出した瞬間にエラーが生じる
    const camp = latestPublishedCamp.value
    if (!camp) throw new Error('最新の合宿情報が初期化されていません')
    return camp
  })
  const latestCampId = computed(() => latestPublishedCamp.value?.id ?? 0)
  const { data: participants } = useGetCampParticipants(latestCampId, {
    query: { enabled: computed(() => allCamps.value.length > 0) },
  })
  const isRegistered = computed(
    () =>
      hasRegisteredLatest.value ??
      participants.value?.some((participant) => participant.id === user.value.id) ??
      false,
  )
  // パスパラメータから合宿を取得する関数
  const getCampByDisplayId = (displayId: string) => {
    const camp = allCamps.value.find((camp) => camp.displayId === displayId)
    if (!camp) throw new Error(`合宿が見つかりません: ${displayId}`)
    return camp
  }
  // 指定した合宿がユーザーにとって操作可能かどうかを判定
  // ・ユーザーがその合宿に参加している
  // ・合宿が終了していない
  const isOperable = (camp: Camp) =>
    // 最新の合宿かつ登録済みで、かつ終了していない場合のみ操作可能
    latestPublishedCamp.value?.id === camp.id && isRegistered.value && !isCampEndedNow(camp)

  return {
    allCamps,
    latestCamp,
    hasRegisteredLatest: isRegistered,
    getCampByDisplayId,
    isCampEnded: isCampEndedNow,
    isOperable,
  }
}

export const useCampRegistration = () => {
  const queryClient = useQueryClient()
  const { user } = useCurrentUser()
  return useMutation({
    mutationFn: async ({ campId, register }: { campId: number; register: boolean }) => {
      if (register) await postCampRegister(campId)
      else await deleteCampRegister(campId)
    },
    onSuccess: (_, { campId, register }) => {
      hasRegisteredLatest.value = register
      const queryKey = getGetCampParticipantsQueryKey(campId)
      queryClient.setQueryData<User[]>(queryKey, (participants) => {
        if (!participants) return participants
        if (register) {
          // 参加登録後は参加者リストのキャッシュに自分を追加
          if (participants.some((participant) => participant.id === user.value.id)) {
            return participants
          }
          return [...participants, user.value]
        }
        // 参加取り消し後は参加者リストのキャッシュから自分を除外
        return participants.filter((participant) => participant.id !== user.value.id)
      })
    },
  })
}
