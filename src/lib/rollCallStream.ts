import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

// 同一ユーザーが複数リアクションを送信していない前提

type RollCallReactionEvent = components['schemas']['RollCallReactionEvent']
type RollCall = components['schemas']['RollCallResponse']
type RollCallReaction = components['schemas']['RollCallReactionResponse']

// 点呼リアクションの SSE 購読
const listenRollCallReactions = (
  rollCallId: number,
  onEvent: (ev: RollCallReactionEvent) => void,
) => {
  const es = new EventSource(`/api/roll-calls/${rollCallId}/reactions/stream`, {
    withCredentials: false,
  })

  es.onmessage = (e) => {
    try {
      const data: RollCallReactionEvent = JSON.parse(e.data)
      onEvent(data)
    } catch (err) {
      // 受信データが不正でも致命的ではないため握りつぶす
      console.error('SSE parse error', err)
    }
  }

  es.onerror = (e) => {
    console.warn('SSE error', e)
    // 接続エラー時は自動で再接続されるため閉じない
  }

  return () => es.close()
}

// 点呼リアクションの送受信を行う composable
export function useRollCallStream(rollcall: RollCall, userId: string) {
  const reactions = ref<RollCallReaction[]>([])
  const stopStream = ref<() => void>()

  // 自分の送信済みリアクション
  const myReaction = computed(() => reactions.value.find((r) => r.userId === userId))

  // すでに存在するリアクション一覧を取得
  const fetchReactions = async () => {
    const { data, error } = await apiClient.GET('/api/roll-calls/{rollCallId}/reactions', {
      params: { path: { rollCallId: rollcall.id } },
    })
    if (error || !data) throw error ?? new Error('Failed to fetch reactions')
    reactions.value = data
  }

  // 未回答、回答済みは選択肢ごとにユーザーを集計
  const grouped = computed(() => {
    if (!rollcall)
      return { unanswered: [] as string[], options: [] as { name: string; ids: string[] }[] }
    const options = rollcall.options.map((name) => ({ name, ids: [] as string[] }))
    const answered = new Set<string>()
    for (const r of reactions.value) {
      const o = options.find((opt) => opt.name === r.content)
      if (o) {
        o.ids.push(r.userId)
        answered.add(r.userId)
      }
    }
    const unanswered = rollcall.subjects.filter((id) => !answered.has(id))
    return { unanswered, options }
  })

  // リアクション送信・更新
  const chooseOption = async (content: string) => {
    if (!rollcall) return
    if (!rollcall.subjects.includes(userId)) return
    if (myReaction.value && myReaction.value.content === content) return

    try {
      if (!myReaction.value) {
        // まだリアクションがない場合は新規作成
        const { data, error } = await apiClient.POST('/api/roll-calls/{rollCallId}/reactions', {
          params: { path: { rollCallId: rollcall.id } },
          body: { content },
        })
        if (error || !data) throw error ?? new Error('failed to post reaction')
        reactions.value.push(data)
      } else {
        // すでにリアクションがある場合は更新
        const { data, error } = await apiClient.PUT('/api/reactions/{reactionId}', {
          params: { path: { reactionId: myReaction.value.id } },
          body: { content },
        })
        if (error || !data) throw error ?? new Error('failed to update reaction')
        const idx = reactions.value.findIndex((r) => r.id === data.id)
        if (idx >= 0) reactions.value[idx] = data
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(async () => {
    await fetchReactions()
    stopStream.value = listenRollCallReactions(rollcall.id, (ev) => {
      switch (ev.type) {
        case 'created': {
          const idx = reactions.value.findIndex((r) => r.id === ev.id)
          const entry = { id: ev.id, userId: ev.userId, content: ev.content }
          if (idx >= 0) reactions.value[idx] = entry
          else reactions.value.push(entry)
          break
        }
        case 'updated': {
          const idx = reactions.value.findIndex((r) => r.id === ev.id)
          if (idx >= 0) reactions.value[idx] = { id: ev.id, userId: ev.userId, content: ev.content }
          break
        }
        case 'deleted': {
          reactions.value = reactions.value.filter((r) => r.id !== ev.id)
          break
        }
      }
    })
  })

  onBeforeUnmount(() => stopStream.value?.())

  return { reactions, myReaction, grouped, chooseOption }
}
