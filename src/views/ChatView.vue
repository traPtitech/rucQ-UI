<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ChatPost from '@/components/chat/ChatPost.vue'
// import { sampleTweets } from '@/lib/sample-data'
// import { useDisplay } from 'vuetify'
// const { xs } = useDisplay()

// 編集や削除機能もない、シンプルなリアルタイム呟き投稿場所

// 仮の型定義
type Tweet = {
  id: number
  content: string
  created_at: string
  author: string
}

const ws = ref<WebSocket | null>(null)
const tweets = ref<Tweet[]>([])
const newTweet = ref('')

// WebSocket 接続
const connectWebSocket = () => {
  ws.value = new WebSocket('ws://localhost:8080/ws')
  // バックエンド側ですでに HTTP 通信に使われている 8080 とは違うポートを立てた方がよいのだろうか？
  // 技術的なところあまりよくわかっていない

  ws.value.onmessage = (event: MessageEvent) => {
    tweets.value.unshift(JSON.parse(event.data))
  }

  ws.value.onclose = () => {
    setTimeout(connectWebSocket, 3000) // 3秒後に再接続
  }
}

// メッセージ送信
const sendMessage = () => {
  if (ws.value && newTweet.value.trim()) {
    ws.value.send(JSON.stringify({ content: newTweet.value.trim() }))
    newTweet.value = ''
  }
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  ws.value?.close()
})
</script>

<template>
  <div :class="$style.container">
    <v-infinite-scroll :class="$style.content" @load="() => {}">
      <v-list style="width: 100%; position: absolute; padding: 0 8px">
        <ChatPost
          v-for="tweet in tweets"
          :key="tweet.id"
          :tweet="tweet"
          style="width: 100%; max-width: 800px; margin: 0 auto"
        />
      </v-list>
    </v-infinite-scroll>
    <div style="width: 100%; background-color: var(--color-theme-pale); padding: 16px 12px">
      <v-textarea
        :class="$style.tweetInput"
        max-rows="8"
        v-model="newTweet"
        rows="1"
        variant="solo"
        auto-grow
        placeholder="メッセージを入力"
        prepend-inner-icon="mdi-comment"
        bg-color="white"
        :hide-details="true"
        style="max-width: 800px; margin: 0 auto"
      >
        <template v-slot:append-inner>
          <v-btn
            @click="sendMessage"
            :disabled="!newTweet"
            icon="mdi-send"
            variant="plain"
            density="compact"
          />
        </template>
      </v-textarea>
    </div>
  </div>
</template>

<style module>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.content {
  height: 100%;
  width: 100%;
  position: relative;
}

.tweetInput :global(.v-field) {
  box-shadow: none !important;
}
</style>
