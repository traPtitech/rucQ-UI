<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { markedHighlight } from 'marked-highlight'
import { Marked } from 'marked'
import hljs from 'highlight.js'
import darkStyle from 'highlight.js/styles/github-dark.css?inline'

type HeadingInfo = {
  id: string
  level: number
  text: string
}

const props = defineProps<{
  mdtext: string
}>()

const headings = defineModel<HeadingInfo[]>('headings')
const htmltext = ref('')

const marked = new Marked(
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
  {
    gfm: true, // GitHub Flavored Markdown を有効にする
    breaks: true, // 1段の改行を有効にする
  },
)

// mdtext 変更時に HTML と見出し情報を更新
watch(
  () => props.mdtext,
  () => {
    const tempHtml = marked.parse(props.mdtext || '') as string
    const headingInfos: HeadingInfo[] = []
    let idCounter = 0

    // 見出しに ID を追加しつつ、見出し情報も抽出
    const htmlWithIds = tempHtml.replace(/<h([1-6])>(.*?)<\/h[1-6]>/gi, (_, level, content) => {
      const id = `heading-${idCounter++}`
      const cleanText = content.replace(/<[^>]*>/g, '')
      headingInfos.push({ id, level: parseInt(level), text: cleanText })
      return `<h${level} id="${id}">${content}</h${level}>`
    })

    htmltext.value = htmlWithIds.replace('<pre><code>', '<pre><code class="hljs">')
    headings.value = headingInfos
  },
  { immediate: true },
)

onMounted(async () => {
  const highlightStyleTag = document.createElement('style')
  highlightStyleTag.textContent = darkStyle
  document.head.appendChild(highlightStyleTag)
})
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <div v-html="htmltext" :class="$style.preview"></div>
    </div>
  </div>
</template>

<style module>
.content {
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow-y: auto;
}

.preview {
  width: 100%;
  height: fit-content;
  min-height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 12px;
}

.preview :global(p) {
  font-size: 1em;
  line-height: 1.4;
  margin-bottom: 0.3lh;
}

.preview :global(p):last-child {
  margin-bottom: 0 !important;
}

.preview :global(h1),
.preview :global(h2),
.preview :global(h3),
.preview :global(h4),
.preview :global(h5),
.preview :global(h6) {
  margin: 12px 0 8px 0;
  font-weight: bold;
  letter-spacing: 0.05em;
}

.preview :global(h1):first-child,
.preview :global(h2):first-child,
.preview :global(h3):first-child,
.preview :global(h4):first-child,
.preview :global(h5):first-child,
.preview :global(h6):first-child {
  margin-top: 0 !important;
}

.preview :global(strong) {
  font-weight: bold;
}

.preview :global(code) {
  font-family: 'M PLUS Code Latin 60', 'M PLUS 1p';
  font-weight: 500;
  font-size: 10pt;
}

.preview :global(pre code) {
  margin: 0 0px 8px 0px !important;
  border-radius: 4px;
  max-height: 400px;
  overflow: scroll;
  background-color: #222222 !important;
}

.preview :global(p code) {
  padding: 2px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.preview :global(ul),
.preview :global(ol) {
  padding: 0px 0px 0px 20px;
}

/* .preview :global(li) {
  margin-bottom: 8px;
} */

.preview :global(blockquote) {
  border-radius: 0px;
  color: #888888;
  padding: 0px 0px 0px 10px;
  border-left: 4px solid #e0e0e0;
  margin: 8px 0 8px 4px;
}

.preview :global(tr:nth-child(2n + 1)) {
  background-color: #fafafa;
}

.preview :global(tr:nth-child(2n + 2)) {
  background-color: #f0f0f0;
}

.preview :global(th),
.preview :global(td) {
  padding: 4px 8px;
}

.preview :global(th) {
  font-weight: bold;
  background-color: rgb(var(--v-theme-primaryLight)) !important;
}

.preview :global(table) {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px !important;
  border-radius: 2px;
  overflow: hidden;
}

.preview :global(a) {
  color: #0066ff !important;
  text-decoration: none;
}

.preview :global(a):hover {
  text-decoration: underline;
}

.preview :global(hr) {
  border: none;
  border-top: 1px solid #ccc;
  margin: 16px 0;
}
</style>
