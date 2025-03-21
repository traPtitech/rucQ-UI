<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { marked, Marked } from 'marked'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

// あとでvuetifyにします
import penIcon from '@/assets/penIcon.svg'
import penIconActive from '@/assets/penIconActive.svg'
import splitIcon from '@/assets/splitIcon.svg'
import splitIconActive from '@/assets/splitIconActive.svg'
import eyeIcon from '@/assets/eyeIcon.svg'
import eyeIconActive from '@/assets/eyeIconActive.svg'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'

const markdown = ref(`# 2024年度 夏合宿

## 概要
9/10(火)-9/12(木)
山中湖の[三盛荘](http://mitsumoriso.jp/)

## 注意事項
- **タオル、浴衣などのアメニティはありません。** 各自持参してください。
`)
const viewMode = ref('split')

const previewHtml = computed(() => marked(markdown.value))

const router = useRouter()

const isSaved = ref(true) /* 保存されたかどうかのフラグ 　未保存で消えちゃった、にならないように*/

const handleResize = () => {
  /*　画面幅によってviewModeを変更する　スマホモードの時にsplitいらない*/
  if (xs) {
    viewMode.value = 'edit'
  }
}

// 入力変更時に isSaved を false に設定する
const handleInputChange = () => {
  isSaved.value = false
}

// // ルート離脱時に自動保存 するかは未定
// onBeforeRouteLeave((to, from, next) => {
//   if (!isSaved.value) {
//     saveMarkdown()
//     next()
//   } else {
//     next()
//   }
// })

// // ウィンドウのリロードやタブを閉じる際に自動保存 するかは未定
// const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//   if (!isSaved.value) {
//     saveMarkdown()
//     // 一部のブラウザでは以下の設定が必要　by gpt
//     event.preventDefault()
//     event.returnValue = ''
//   }
// }

marked.setOptions({
  gfm: true, // GitHub Flavored Markdown を有効にする
  breaks: true, // 改行を有効にする（純正Markdownでは1段の改行がスペースに変換される決まりだが、それでは困るので）
})

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (typeof lang === 'string' && lang.includes(':')) {
        lang = lang.substring(0, lang.indexOf(':'))
      }
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)

  try {
    response.value = (await apiClient.GET('/api/camps/default')).data!
    console.log('API response:', response)

    if (response.value && typeof response.value.description === 'string') {
      markdown.value = response.value.description
    } else {
      console.error('Invalid response format:', response)
    }
  } catch (error) {
    console.error('Failed to fetch camps:', error)
  }
})

const response = ref<components['schemas']['Camp']>({
  id: 0,
  display_id: '',
  description: '',
  name: '',
  is_draft: false,
})

// 保存関数
const saveMarkdown = async () => {
  alert('保存しました')
  isSaved.value = true
  await apiClient.PUT('/api/camps/{camp_id}', {
    params: { path: { camp_id: response.value.id } },
    body: {
      display_id: '24spring',
      description: markdown.value,
      name: '2024年度 春合宿',
      is_draft: false,
    },
  })
  console.log('API response:', response.value)

  console.log('API responsほぞん:')
}

function showEditOnly() {
  viewMode.value = 'edit'
}
function showSplit() {
  viewMode.value = 'split'
}
function showPreviewOnly() {
  viewMode.value = 'preview'
}

// 保存関数（blurイベント用）　カーソルが離れたら保存する
const saveMarkdownAsync = async () => {
  try {
    await apiClient.PUT('/api/camps/{camp_id}', {
      params: { path: { camp_id: response.value.id } },
      body: {
        display_id: '24spring',
        description: markdown.value,
        name: '2024年度 春合宿', // この辺は後で決める
        is_draft: false,
      },
    })
    isSaved.value = true // 保存に成功した場合
  } catch (error) {
    console.error('保存に失敗しました:', error)
    isSaved.value = false // 保存に失敗した場合
  }
}

// blurイベントハンドラー
const handleBlur = () => {
  if (!isSaved.value) {
    saveMarkdownAsync()
  }
}

function getdefaultCamps() {
  throw new Error('Function not implemented.')
}
</script>

<template>
  <div class="admin-header">
    <div class="back-button"><</div>
    <h1>Guidebook Editor</h1>
  </div>

  <div class="admin-container">
    <div class="toolbar">
      <div class="editer-toolbar">
        <img
          :src="viewMode === 'edit' ? penIconActive : penIcon"
          alt="Pen Icon"
          @click="showEditOnly"
          :class="{ 'active-background': viewMode === 'edit' }"
        />
        <img
          v-if="!xs"
          :src="viewMode === 'split' ? splitIconActive : splitIcon"
          alt="Split Icon"
          @click="showSplit"
          :class="{ 'active-background': viewMode === 'split' }"
        />
        <img
          :src="viewMode === 'preview' ? eyeIconActive : eyeIcon"
          alt="Eye Icon"
          @click="showPreviewOnly"
          :class="{ 'active-background': viewMode === 'preview' }"
        />
      </div>
      <button class="save-button" @click="saveMarkdown">
        <img src="@/assets/saveIcon.svg" alt="Save Icon" />{{ isSaved ? '保存済み' : '未保存' }}
      </button>
    </div>
    <div class="editor-preview">
      <textarea
        v-if="viewMode === 'edit' || viewMode === 'split'"
        v-model="markdown"
        class="editor-area"
        @input="handleInputChange"
        @blur="handleBlur"
      ></textarea>
      <div class="center-bar" v-if="viewMode === 'split'"></div>
      <div
        :class="['preview-section', 'markdown']"
        v-if="viewMode === 'preview' || viewMode === 'split'"
        v-html="previewHtml"
      ></div>
    </div>
  </div>
</template>

<style>
/* ヘッダー */
.admin-header {
  background-color: #ced3d9;
  color: #2a2639;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  font-size: 0.8rem;
}

.admin-header h1 {
  margin-top: 10px;
}

.back-button {
  /*仮の戻るボタン　後で消す*/
  position: absolute;
  left: 1rem;
  cursor: pointer;
  font-size: 0.8rem;
}

/* コンテナ */
.admin-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  overflow: hidden;
}

/* エディタとプレビュー */
.editor-preview {
  display: flex;
  padding: 0;
  margin: 0;
  padding-bottom: 0px;
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
}

.editor-area {
  flex: 1;
  font-family: 'Fira Code', monospace;
  caret-color: #146ad4; /* カーソルの色を白に変更 */
  min-height: 100%;
  background-color: #101620;
  color: #ccc;
  resize: none; /* サイズ変更を無効化 */
  outline: none; /* フォーカス時の枠線を消す */
  height: 100%;
  overflow-y: scroll;
}

.center-bar {
  width: 5px;
  background-color: #f8f8f8;
  box-shadow: 1px 0px 5px -2px #000;
  z-index: 10;
}

.preview-section {
  background-color: #f8f8f8;
  color: #101620;
  line-height: 1.8;
  flex: 1;
  margin: 0 auto; /* 中央揃え */
  padding-left: 30px;
  padding-right: 30px;
  height: 100%;
  overflow-y: scroll;
}

.toolbar {
  /*ヘッダーと同じ色にしたい*/
  background-color: #ced3d9;
  border-bottom: 1px solid #9fa0a7;
  position: relative;
  display: flex;
  font-style: column;
  text-align: center;
  padding: 0px;
  height: 40px;
  font-size: 0.9rem;
}

.editer-toolbar {
  display: flex;
  gap: 2px;
  justify-content: center;
  align-items: center;
  padding: 0 15px;
  margin: 0;
}

.editer-toolbar img {
  cursor: pointer;
  background-color: #a8acb1;
  border: 0.2px solid #8e9094;
  padding: 8px;
  margin: 0;
  border-radius: 6px;
  transition:
    background-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.editer-toolbar img.active-background {
  background-color: #7a8289;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editer-toolbar img.active-background:hover {
  background-color: #7a8289;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.editer-toolbar img:hover {
  background-color: #979ba0;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.toolbar img {
  cursor: pointer;
  padding: 3px;
  margin: 0;
}

/* 保存ボタン */
.save-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 2px;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-color: #b4b8bc;
  border: 0.2px solid #8e9094;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #1c1c1e;
  cursor: pointer;
  font-size: 0.9rem;
  padding-right: 5px;
}

.save-button:hover {
  background-color: #929496;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.save-button:active {
  background-color: #838587;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
