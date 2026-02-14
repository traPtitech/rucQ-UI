<script setup lang="ts">
import { ref, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'

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

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
})

// mdtext 変更時に HTML と見出し情報を更新
watch(
  () => props.mdtext,
  () => {
    const rawHtml = md.render(props.mdtext || '')
    const headingInfos: HeadingInfo[] = []
    let idCounter = 0

    // DOMPurify を使用して HTML をサニタイズ（script 等を除去）
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'a',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'strong',
        'em',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'hr',
        'br',
        'span',
        's',
        'del',
      ],
      ALLOWED_ATTR: ['class', 'id', 'href'],
    })

    // DOM パーサーを使用して安全に見出しを処理
    const parser = new DOMParser()
    const doc = parser.parseFromString(cleanHtml, 'text/html')
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

    headingElements.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1))
      const id = `heading-${idCounter++}`
      const text = heading.textContent ?? ''

      heading.setAttribute('id', id)
      headingInfos.push({ id, level, text })
    })

    htmltext.value = doc.body.innerHTML
    headings.value = headingInfos
  },
  { immediate: true },
)
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div :class="$style.preview" v-html="htmltext"></div>
    </div>
  </div>
</template>

<style module>
.content {
  z-index: -1;
}

.preview {
  width: 100%;
  height: fit-content;
  min-height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  font-size: 14px;
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
  font-family: 'M PLUS Code Latin Variable', 'M PLUS 2 Variable';
  font-variation-settings: 'wdth' 120;
  font-weight: 500;
  font-size: 10pt;
  padding: 2px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.preview :global(pre) {
  margin: 0 0px 8px 0px !important;
  border-radius: 4px;
  max-height: 400px;
  overflow: auto;
  background-color: #222222;
  color: #f0f0f0;
  padding: 12px;
}

.preview :global(pre code) {
  background-color: transparent;
  padding: 0;
}

.preview :global(ul),
.preview :global(ol) {
  padding: 0px 0px 8px 20px;
}

/* .preview :global(li) {
  margin-bottom: 8px;
} */

.preview :global(blockquote) {
  border-radius: 0px;
  color: #888888;
  padding: 0px 0px 0px 10px;
  border-left: 4px solid #e0e0e0;
  margin: 8px 0;
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
  margin: 8px 0;
  border-radius: 2px;
  overflow: hidden;
}

.preview :global(a) {
  color: #0066ff !important;
  text-decoration: none;
  font-weight: 500;
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
