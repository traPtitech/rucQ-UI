<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { decorated } from '@/components/markdown/utils/editorParse'
const text = defineModel<string>('text')

const props = defineProps<{ color?: string | undefined }>()

const isComposing = ref(false)
const textAll = ref('') // 変換中の部分を含めたテキスト全体
const underline = ref<{ start: number; end: number }>({ start: 0, end: 0 })

const ta = ref<HTMLTextAreaElement>()

// ta.value.value: 変換を含む
// text.value: 変換を含まない

const handleInput = () => {
  if (!ta.value) return
  textAll.value = ta.value.value
  const s = { start: ta.value.selectionStart, end: ta.value.selectionEnd }

  nextTick(() => {
    if (!ta.value || text.value === undefined) return // 空文字も false なので !text.value はダメ
    if (isComposing.value) {
      if (s.start === s.end) {
        underline.value.start = s.end - (ta.value.value.length - text.value.length)
      } else {
        underline.value.start = s.start
      }
    } else {
      underline.value.start = s.end
    }
    underline.value.end = s.end

    // カーソル位置を強制的に維持
    ta.value.setSelectionRange(s.start, s.end)
  })
}

watch(() => text.value, handleInput)
onMounted(() => nextTick(handleInput))

const handleCompose = (state: boolean) => {
  isComposing.value = state
  text.value = textAll.value
  handleInput()
}

const enclose = (symbol: string) => {
  if (!ta.value || text.value === undefined) return
  ta.value.focus()
  const s = { start: ta.value.selectionStart, end: ta.value.selectionEnd }
  let tempText = text.value // text.value は ModelRef 型であり、即座に変更させてくれない
  tempText = tempText.slice(0, s.end) + symbol + tempText.slice(s.end, tempText.length)
  tempText = tempText.slice(0, s.start) + symbol + tempText.slice(s.start, tempText.length)
  text.value = tempText
  const cursorPos = s.start === s.end ? s.end + symbol.length : s.end + 2 * symbol.length
  nextTick(() => {
    if (!ta.value) return
    ta.value.setSelectionRange(cursorPos, cursorPos)
    handleInput()
  })
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.scrollable">
      <div :class="$style.content">
        <!-- height: 100% は textarea 左脇の点線を伸ばすため -->
        <div :class="$style.headSpace"></div>
        <div :class="[$style.border, `text-${props.color}`, $style.colorTransition]"></div>
        <div :class="$style.inputSpace">
          <!-- height: 100% は、textarea が画面内に完全に収まる場合も縦に引き伸ばすため -->
          <textarea
            ref="ta"
            v-model="text"
            :class="$style.input"
            @input="handleInput"
            @compositionstart="handleCompose(true)"
            @compositionend="handleCompose(false)"
          ></textarea>
          <div :class="$style.dummy">
            <div
              v-for="(line, i) in decorated(textAll, underline)"
              :key="i"
              :class="$style.dummyLine"
            >
              <div :class="$style.lineNumber">
                <p :class="[`text-right text-${props.color}`, $style.colorTransition]">
                  {{ i + 1 }}
                </p>
              </div>
              <span
                v-for="(part, j) in line"
                :key="j"
                :class="$style.dummyLineText"
                :style="part.style"
              >
                {{ part.part }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.tools">
      <slot></slot>
      <v-btn
        density="comfortable"
        elevation="0"
        icon="mdi-format-bold"
        @click="enclose('**')"
      ></v-btn>
      <v-btn
        density="comfortable"
        elevation="0"
        icon="mdi-format-italic"
        @click="enclose('*')"
      ></v-btn>
      <v-btn
        density="comfortable"
        elevation="0"
        icon="mdi-format-strikethrough"
        @click="enclose('~~')"
      ></v-btn>
    </div>
  </div>
</template>

<style module>
.colorTransition {
  transition-property: color, background-color, border-color, fill, stroke;
  transition-duration: 0.28s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.container {
  color: var(--color-text);
  width: 100%;
  height: 100%;
  font-family: 'M PLUS Code Latin', 'M PLUS 1p';
  font-weight: 400;
  display: flex;
}

.scrollable {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.content {
  width: 100%;
  height: 100%;
  padding: 10px 0 10px 10px;
  min-height: fit-content;
  display: flex;
  align-items: stretch;
}

.headSpace {
  padding-left: 26px;
  flex-shrink: 0;
}

.border {
  flex-shrink: 0;
  border-left: 1px dashed;
  padding-right: 6px;
}

.inputSpace {
  width: calc(100% - 33px);
  height: 100%;
  min-height: fit-content;
  flex-shrink: 1;
  position: relative;
}

.dummy {
  top: 0px;
  width: 100%;
  padding-bottom: 4em;
  font-family: 'M PLUS Code Latin', 'M PLUS 1p';
  z-index: 0;
}

.dummyLine {
  position: relative;
  min-height: 1.4em;
  line-height: 1.4;
}

.lineNumber {
  position: absolute;
  left: -42px;
  width: 30px;
}

.dummyLineText {
  position: relative;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.input {
  position: absolute;
  width: 100%;
  height: 100%;
  resize: none;
  line-height: 1.4;
  z-index: 1;
  color: transparent;
  caret-color: black;
}

.tools {
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 6px;
}
</style>
