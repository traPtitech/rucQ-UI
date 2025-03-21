<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { decorated } from '@/lib/editor-parse'
const text = defineModel<string>('text')

defineProps<{ color?: string | undefined }>()

const isComposing = ref(false)
const textAll = ref('') // 変換中の部分を含めたテキスト全体
const underline = ref<{ start: number; end: number }>({ start: 0, end: 0 })

const ta = ref<HTMLTextAreaElement>()

// textarea における各値の仕様まとめ（以下 ta とは HTMLTextAreaElement のこと ↑ ）

// ta.value.value
// ... 変換中の部分を含め、ユーザーに見えるテキスト全体を表す。変換が発生しない英字の打ち込みでは text.value に一致する

// text.value（textarea の v-model に設定されたリアクティブ変数）
// ... 最後に変換が確定した時点でのテキスト全体を表す。変換中の操作は反映されない

// ta.value.selectionStart & ta.value.selectionEnd
// ... 変換中の部分あるいは範囲選択した部分を表す。何も選択せず打ち込んでいる最中は両方とも ta.value.value におけるカーソルの位置を表す

// 自動変換機能（Mac 特有かも？）においては、日本語で打ち込んでいる最中は常に変換中の扱い（isComposing = true）になり、
// 「selectionStart と selectionEnd がともに終端のカーソルの位置を指したまま」
// 最後に更新された text.value から変更が加わった箇所全体に下線が引かれる
// スペースキーなどを押して明示的に変換を開始すると selectionStart と selectionEnd が変換中の部分を反映する
// すなわち selectionStart から selectionEnd までに下線を引くことにすると Mac における ta の自然な振る舞いに沿わない

// 下線を引く部分は以下のように決める
// 変換中じゃない場合は ta.value.value 上で selectionEnd ちょうどの 0 文字。変換中の場合 ↓
// selectionStart !== selectionEnd の場合： そのまま selectionStart から selectionEnd まで
// selectionStart === selectionEnd の場合： ta.value.value 上で selectionEnd 以前の ta.value.value.length - text.value.length 文字

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
    <div style="width: 100%; height: 100%; overflow-y: auto">
      <div
        style="
          width: 100%;
          height: 100%;
          padding: 10px 0 10px 10px;
          min-height: fit-content;
          display: flex;
          align-items: stretch;
        "
      >
        <!-- height: 100% は textarea 左脇の点線を伸ばすため -->
        <div style="padding-left: 26px; flex-shrink: 0"></div>
        <div
          :style="`flex-shrink: 0; border-left: 1px dashed var(--color-${color || 'theme'}); padding-right: 6px;`"
        ></div>
        <div
          style="
            width: calc(100% - 33px);
            height: 100%;
            min-height: fit-content;
            flex-shrink: 1;
            position: relative;
          "
        >
          <!-- height: 100% は、textarea が画面内に完全に収まる場合も縦に引き伸ばすため -->
          <textarea
            ref="ta"
            v-model="text"
            @input="handleInput"
            @compositionstart="handleCompose(true)"
            @compositionend="handleCompose(false)"
            :class="$style.input"
          ></textarea>
          <div :class="$style.dummy">
            <div
              v-for="(line, i) in decorated(textAll, underline)"
              :key="i"
              :class="$style.dummyLine"
            >
              <div :class="$style.lineNumber">
                <p
                  :class="$style.lineNumberText"
                  :style="`color: var(--color-${color || 'theme'})`"
                >
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
      <!-- <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-undo"
          baseColor="transparent"
          class="text-primary"
          :style="{ color: 'red' }"
        ></v-btn> -->
      <!-- document.execCommand('undo') が非推奨になっていて、自力実装の必要がありそうなので保留 -->
      <v-btn
        @click="enclose('**')"
        density="comfortable"
        elevation="0"
        icon="mdi-format-bold"
        baseColor="transparent"
      ></v-btn>
      <v-btn
        @click="enclose('*')"
        density="comfortable"
        elevation="0"
        icon="mdi-format-italic"
        baseColor="transparent"
      ></v-btn>
      <v-btn
        @click="enclose('~~')"
        density="comfortable"
        elevation="0"
        icon="mdi-format-strikethrough"
        baseColor="transparent"
      ></v-btn>
    </div>
  </div>
</template>

<style module>
.container {
  color: var(--color-text);
  width: 100%;
  height: 100%;
  font-family: 'M PLUS Code Latin', 'M PLUS 1p';
  font-weight: 400;
  display: flex;
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

.lineNumberText {
  text-align: right;
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
