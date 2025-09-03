export const meKeys = {
  all: ['me'] as const,
}

export const campKeys = {
  all: ['camps'] as const,

  lists: () => ['camps', 'list'] as const,
  list: (filters?: string) => ['camps', 'list', filters ?? null] as const,

  details: () => ['camps', 'detail'] as const ,
  detail: (id: number) => ['camps', 'detail', id] as const ,

  participants: (id: number) => ['camps', 'detail', id, 'participants'] as const,
}

// Icon-related keys
export const iconKeys = {
  all: ['icons'] as const,
  user: (id: string) => ['icons', 'user', id] as const,
}

export const qk = {
  me: meKeys,
  camps: campKeys,
  icons: iconKeys,
}


