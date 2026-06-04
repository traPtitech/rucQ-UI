// openapi-typescript を使用して OpenAPI スキーマから TypeScript 型定義を作成し
// Response で終わる型定義の名前から Response を削除して保存するスクリプト

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SCHEMA_URL = 'https://raw.githubusercontent.com/traPtitech/rucQ/main/openapi.yaml'
const OUTPUT_DIR = './src/api'
const FINAL_OUTPUT = path.join(OUTPUT_DIR, 'schema.d.ts')
const TEMP_FILE = path.join(OUTPUT_DIR, 'schema_temp.d.ts')

try {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  // openapi-typescript の実行
  execSync(
    `pnpm exec openapi-typescript ${SCHEMA_URL}` +
      ` --root-types --root-types-no-schema-prefix -o ${TEMP_FILE}`,
  )

  // ファイルの読み込みと 1 行ずつの置換処理
  const content = fs.readFileSync(TEMP_FILE, 'utf-8')
  const lines = content.split('\n')

  const processedLines = lines.map(
    // アルファベット大文字で始まる型名のみを対象として副作用防止
    (line) =>
      /^export type [A-Z].*Response =/.test(line)
        ? line.replace(/^export type (\S+)Response =/, 'export type $1 =')
        : line,
  )

  // 最終的なファイルに書き込み
  fs.writeFileSync(FINAL_OUTPUT, processedLines.join('\n'), 'utf-8')
  fs.unlinkSync(TEMP_FILE)
} catch (error) {
  console.error('型定義の生成中にエラーが発生しました:', error)
  if (fs.existsSync(TEMP_FILE)) fs.unlinkSync(TEMP_FILE)
}
