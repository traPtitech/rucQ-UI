// 見やすさのためにエディタ上でも簡単な装飾を施すスクリプト
// 色の変更はなし。太字 / 斜体 / 下線（リンク）/ 取消線 のみ
// marked.js の実装とも異なるので複雑なことをすると壊れる

type Range = { start: number; end: number }
type DecoParts = { parts: { shell: Range; kernel: Range }[]; effect: boolean }

const matchDivision = (line: string, parts: { shell: Range; kernel: Range }[], reg: RegExp) => {
  let completed = 'A'.repeat(line.length)
  for (const part of parts) {
    const content = line.slice(part.kernel.start, part.kernel.end)
    completed =
      completed.slice(0, part.kernel.start) +
      content +
      completed.slice(part.kernel.end, line.length)
  }

  // 仮置きのアルファベット A によって補完されたテキスト completed ができた
  // text の情報をそのまま持ってきたいので decorated の内部に関数を定義している

  const division: DecoParts[] = []
  const base: DecoParts = { parts: [], effect: false }

  let last = 0
  for (const match of [...completed.matchAll(reg)]) {
    base.parts.push({
      shell: { start: last, end: match['index'] },
      kernel: { start: last, end: match['index'] },
    })
    if (!match[1]) {
      match[1] = match[0]
    }
    const kernelIndex = match['index'] + match[0].indexOf(match[1])
    // match[0] は **bb** で match[1] は bb
    division.push({
      parts: [
        {
          shell: {
            start: match['index'],
            end: match['index'] + match[0].length,
          },
          kernel: {
            start: kernelIndex,
            end: kernelIndex + match[1].length,
          },
        },
      ],
      effect: true,
    })
    last = match['index'] + match[0].length
  }
  base.parts.push({
    shell: { start: last, end: completed.length },
    kernel: { start: last, end: completed.length },
  })
  division.push(base)

  // テキスト completed を正規表現マッチ内外の領域に分割した

  return division
}

const overWrite = (effect: boolean[], toAdd: DecoParts) => {
  if (toAdd.effect) {
    for (const part of toAdd.parts) {
      effect.splice(
        part.shell.start,
        part.shell.end - part.shell.start,
        ...Array(part.shell.end - part.shell.start).fill(true),
      )
      // Typescript における配列は参照渡しなので、parts を書き換えればもとの引数にも反映される
    }
  }
}

export const decorated = (textAll: string, underline: { start: number; end: number }) => {
  // cursorPos はカーソル位置、length は変換中のテキストの長さを表す

  const text = textAll.slice(0, underline.start) + textAll.slice(underline.end, textAll.length)
  // console.log(`${cursorPos}: ${textAll} = ${text} + ${composing}`)

  const parsedStyle = (style: boolean[]) =>
    (style[0] ? 'font-weight: bold; ' : '') +
    (style[1] ? 'font-style: italic; ' : '') +
    (style[2] ? 'text-decoration: line-through ' : 'text-decoration: ') +
    (style[3] ? 'underline ' : '') +
    (!(style[2] || style[3]) ? 'none;' : ';')

  const charEffects: boolean[][] = []

  for (const line of text.split('\n')) {
    const wholeLine: { shell: Range; kernel: Range }[] = [
      {
        shell: { start: 0, end: line.length },
        kernel: { start: 0, end: line.length },
      },
    ]
    const effectChars: boolean[][] = [
      Array(line.length).fill(false),
      Array(line.length).fill(false),
      Array(line.length).fill(false),
      Array(line.length).fill(false),
    ]
    // effectChars[0] は bold, [1] は italic, [2] は strike, [3] は link

    if (line === '---' || /^#{1,6} /.test(line)) {
      effectChars[0] = Array(line.length).fill(true)
    }

    for (const bold of matchDivision(line, wholeLine, /\*\*([^\*\s]|[^\*\s].*?[^\*\s])\*\*/g)) {
      overWrite(effectChars[0], bold)
      for (const italic of matchDivision(line, bold.parts, /\*([^\*\s]|[^\*\s].*?[^\*\s])\*/g)) {
        overWrite(effectChars[1], italic)
        for (const strike of matchDivision(line, italic.parts, /~~([^~\s]|[^~\s].*?[^~\s])~~/g)) {
          overWrite(effectChars[2], strike)
          for (const link of matchDivision(line, strike.parts, /\bhttps?:\/\/[^\s<>"]+/g)) {
            overWrite(effectChars[3], link)
          }
        }
      }
    }
    charEffects.push(...effectChars[0].map((_, c) => effectChars.map((r) => r[c]))) // effectChars の転置
    charEffects.push([false, false, false, false]) // 改行文字分
  }

  // 変換中の部分を追加
  charEffects.splice(
    underline.start,
    0,
    ...Array.from({ length: underline.end - underline.start }, () => [false, false, false, true]),
  )

  const effectLines: { part: string; style: string }[][] = []

  let last = 0 // 前にスタイルが確定した部分が何文字目か
  let lastLine = 0 // 前の行の最後が何文字目か

  for (const line of textAll.split('\n')) {
    const effectLine: { part: string; style: string }[] = []

    for (let j = lastLine + 1; j < lastLine + line.length; j++) {
      const a = charEffects[j - 1]
      const b = charEffects[j]
      if (!(a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3])) {
        effectLine.push({
          part: textAll.slice(last, j),
          style: parsedStyle(charEffects[j - 1]),
        })
        last = j
      }
    }

    if (line.length > 0) {
      effectLine.push({
        part: textAll.slice(last, lastLine + line.length),
        style: parsedStyle(charEffects[lastLine + line.length - 1]),
      })
    }
    last = lastLine + line.length + 1
    effectLines.push(effectLine)
    lastLine = last
  }

  return effectLines
}
