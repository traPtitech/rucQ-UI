const meKeys = {
  all: ['me'] as const,
  questionGroupAnswers: (questionGroupId: number) =>
    ['me', 'question-groups', questionGroupId, 'answers'] as const,
}

const campKeys = {
  all: ['camps'] as const,

  lists: () => ['camps', 'list'] as const,
  list: (filters?: string) => ['camps', 'list', filters ?? null] as const,

  details: () => ['camps', 'detail'] as const,
  detail: (id: number) => ['camps', 'detail', id] as const,

  participants: (id: number) => ['camps', 'detail', id, 'participants'] as const,
  activities: (id: number) => ['camps', 'detail', id, 'activities'] as const,
  events: (id: number) => ['camps', 'detail', id, 'events'] as const,
  roomGroups: (id: number) => ['camps', 'detail', id, 'room-groups'] as const,
  questionGroups: (id: number) => ['camps', 'detail', id, 'question-groups'] as const,
  dashboard: (id: number) => ['camps', 'detail', id, 'dashboard'] as const,
}

const iconKeys = {
  all: ['icons'] as const,
  user: (id: string) => ['icons', 'user', id] as const,
}

const roomKeys = {
  all: ['rooms'] as const,
  statusLogs: (roomId: number) => ['rooms', roomId, 'status-logs'] as const,
}

export const qk = {
  me: meKeys,
  camps: campKeys,
  icons: iconKeys,
  rooms: roomKeys,
}
