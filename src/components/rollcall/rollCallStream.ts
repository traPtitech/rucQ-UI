import {
  RollCallReactionCreatedEventType,
  RollCallReactionDeletedEventType,
  RollCallReactionUpdatedEventType,
} from '@/api/generated/client.schemas'
import type {
  RollCallReactionEvent,
  RollCallReactionResponse as RollCallReaction,
  RollCallResponse as RollCall,
} from '@/api/generated/client.schemas'
import { ref, computed, type Ref } from 'vue'
import {
  usePostRollCallReaction,
  usePutReaction,
  getRollCallReactions,
} from '@/api/generated/client'

// 同一ユーザーが複数リアクションを送信していない前提

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
      const data = JSON.parse(e.data as string) as RollCallReactionEvent
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
export function useRollCallStream(rollcall: Ref<RollCall | undefined>, userId: string) {
  const postReaction = usePostRollCallReaction()
  const updateReaction = usePutReaction()
  const reactions = ref<RollCallReaction[]>([])
  const stopStream = ref<() => void>()

  // 送信中操作（create / update）を一度にひとつしか行えないようにするためのフラグ
  const inFlight = ref(false)

  // 自分の送信済みリアクション
  const myReaction = computed(() => reactions.value.find((r) => r.userId === userId))

  // すでに存在するリアクション一覧を取得
  const fetchReactions = async () => {
    if (!rollcall.value) throw new Error('rollcall is not set')
    return getRollCallReactions(rollcall.value.id)
  }

  // SSE イベントを現在の状態に反映するヘルパー
  const applyEvent = (ev: RollCallReactionEvent) => {
    switch (ev.type) {
      case RollCallReactionCreatedEventType.created: {
        // 同一ユーザーのリアクションを上書きまたは push
        const idx = reactions.value.findIndex((r) => r.userId === ev.userId)
        const entry = { id: ev.id, userId: ev.userId, content: ev.content }
        if (idx >= 0) reactions.value[idx] = entry
        else reactions.value.push(entry)
        break
      }
      case RollCallReactionUpdatedEventType.updated: {
        const idx = reactions.value.findIndex((r) => r.id === ev.id)
        if (idx >= 0)
          reactions.value[idx] = {
            id: ev.id,
            userId: ev.userId,
            content: ev.content,
          }
        break
      }
      case RollCallReactionDeletedEventType.deleted: {
        reactions.value = reactions.value.filter((r) => r.id !== ev.id)
        break
      }
    }
  }

  // 未回答、回答済みは選択肢ごとにユーザーを集計
  const grouped = computed(() => {
    if (!rollcall.value)
      return { unanswered: [] as string[], options: [] as { name: string; ids: string[] }[] }
    const options = rollcall.value.options.map((name) => ({ name, ids: [] as string[] }))
    const answered = new Set<string>()
    for (const r of reactions.value) {
      const o = options.find((opt) => opt.name === r.content)
      if (o) {
        o.ids.push(r.userId)
        answered.add(r.userId)
      }
    }
    const unanswered = rollcall.value.subjects.filter((id) => !answered.has(id))
    return { unanswered, options }
  })

  // リアクション送信・更新
  const chooseOption = async (content: string) => {
    if (!rollcall.value) return
    if (!rollcall.value.subjects.includes(userId)) return
    if (myReaction.value?.content === content) return
    if (inFlight.value) return // いずれかの操作中は他の操作を禁止

    try {
      inFlight.value = true
      if (!myReaction.value) {
        const data = await postReaction.mutateAsync({
          rollCallId: rollcall.value.id,
          data: { content },
        })
        reactions.value.push(data)
      } else {
        // すでにリアクションがある場合は更新
        const data = await updateReaction.mutateAsync({
          reactionId: myReaction.value.id,
          data: { content },
        })
        const idx = reactions.value.findIndex((r) => r.id === data.id)
        if (idx >= 0) reactions.value[idx] = data
      }
    } catch (e) {
      console.error(e)
    } finally {
      inFlight.value = false
    }
  }

  // 明示初期化（ライフサイクルに依存しない）
  const init = async () => {
    if (!rollcall.value) throw new Error('rollcall is not set')
    console.log('Start roll call stream for', rollcall.value.id)

    // 先に SSE を開始し、初期化中はイベントをバッファ
    let initializing = true
    const buffer: RollCallReactionEvent[] = []
    stopStream.value = listenRollCallReactions(rollcall.value.id, (ev) => {
      if (initializing) buffer.push(ev)
      else applyEvent(ev)
    })

    // 既存のリアクション一覧を取得
    try {
      reactions.value = await fetchReactions()
      console.log('Fetched reactions:', reactions.value)
    } catch (e) {
      console.error(e)
    }

    // バッファを反映してライブ運用に切り替え
    // buffer は SSE ハンドラのクロージャで参照されている長命な変数なので明示的に splice で空にする
    const buffered = buffer.splice(0, buffer.length)
    initializing = false
    for (const ev of buffered) applyEvent(ev)
  }

  const stop = () => stopStream.value?.()

  return { reactions, myReaction, grouped, chooseOption, init, stop }
}
