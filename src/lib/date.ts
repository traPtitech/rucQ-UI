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
