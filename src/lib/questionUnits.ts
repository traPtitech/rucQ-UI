import type { components } from '@/api/schema'

type Question = components['schemas']['QuestionResponse']

// 質問配列を 1 列 / 2 列ユニットに整形する純粋関数
export const getQuestionUnits = (
  questions: Question[],
): Array<{ size: 1 | 2; questions: Question[] }> => {
  const units: { size: 1 | 2; questions: Question[] }[] = []
  for (const question of questions) {
    if (question.type === 'free_text' || question.type === 'multiple') {
      units.push({ size: 2, questions: [question] })
    } else {
      if (units.length === 0 || units[units.length - 1].size === 2) {
        units.push({ size: 1, questions: [question] })
      } else {
        units[units.length - 1].questions.push(question)
      }
    }
  }

  // size 1 のユニットが奇数個のときは最後の 1 つを 2 列にして余白を埋める
  for (let i = 0; i < units.length; i++) {
    if (units[i].size === 1 && units[i].questions.length % 2 === 1) {
      const q = units[i].questions.pop()!
      units.splice(i + 1, 0, { size: 2, questions: [q] })
      if (units[i].questions.length === 0) {
        units.splice(i, 1)
      } else {
        i++
      }
    }
  }

  return units
}
