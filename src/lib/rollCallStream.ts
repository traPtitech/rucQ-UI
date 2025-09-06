import type { components } from '@/api/schema'

export type RollCallReactionEvent = components['schemas']['RollCallReactionEvent']

// 点呼リアクションのSSE購読
export const listenRollCallReactions = (
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
