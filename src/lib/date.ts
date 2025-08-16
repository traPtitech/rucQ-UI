// leaQ からそのまま転送

export const getTimeString = (date: Readonly<Date>) =>
  date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')

export const getTimeStringNoPad = (date: Readonly<Date>) =>
  date.getHours().toString() + ':' + date.getMinutes().toString().padStart(2, '0')

export const getDayString = (date: Readonly<Date>) =>
  (date.getMonth() + 1).toString().padStart(2, '0') +
  '/' +
  date.getDate().toString().padStart(2, '0')

export const getDayStringNoPad = (date: Readonly<Date>) =>
  (date.getMonth() + 1).toString() + '/' + date.getDate().toString().padStart(2, '0')

export const getFullDayString = (date: Readonly<Date>) =>
  date.getFullYear() + '/' + getDayString(date)

export const getDisplayDate = (date: Readonly<Date>) => {
  const today = new Date()
  const timeString = getTimeString(date)
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24)

  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return '今日' + ' ' + timeString
  }
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return '昨日' + ' ' + timeString
  }
  if (date.getFullYear() === today.getFullYear()) {
    return getDayString(date) + ' ' + timeString
  } else {
    return getFullDayString(date) + ' ' + timeString
  }
}

// 与えられた日付の JST の Date オブジェクトを返す
export const getJSTDate = (dateString: string): Date => {
  const date = new Date(`${dateString}T00:00:00+09:00`)
  if (isNaN(date.getTime())) {
    throw new Error(`getJSTDate: 日時の設定が不正です: "${dateString}"`)
  }
  return date
}

// 日付を日本時間の ISO 8601 形式の文字列に変換
export const dateToText = (date: Date) => {
  const isoString = new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString()
  return isoString.replace('Z', '+09:00') // 日本時間
}

// 2つの日付の差を日数で返す
export const dateDiffInDaysJST = (startDate: Date, endDate: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24
  const toJstDay = (d: Date) => Math.floor((d.getTime() + 9 * 60 * 60 * 1000) / msPerDay)
  return toJstDay(endDate) - toJstDay(startDate)
}
