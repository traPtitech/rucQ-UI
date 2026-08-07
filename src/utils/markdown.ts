import MarkdownIt from 'markdown-it'

// 再利用可能な MarkdownIt インスタンス
export const md = new MarkdownIt({
  breaks: true,
  linkify: true,
})
