import { computed, ref } from 'vue'

const currentTime = ref(new Date())
let started = false

const updateTime = () => {
  currentTime.value = new Date()
  requestAnimationFrame(updateTime)
}

export const useTime = () => {
  if (!started) {
    started = true
    updateTime() // 呼び出されて即座に現在時刻の更新を開始
  }
  return {
    currentTime: computed(() => currentTime.value),
  }
}
