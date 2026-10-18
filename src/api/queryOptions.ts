// 生成した Query の期限はここで管理し、呼び出し元での上書きより優先する。
export const queryDefaults = {
  staleTime: 60 * 60 * 1000, // 1h
  gcTime: 7 * 24 * 60 * 60 * 1000, // 1週間
}

export const apiQueryOptions = <T extends object>(options: T) => ({ ...options, ...queryDefaults })
export const freshQueryOptions = <T extends object>(options: T) => ({
  ...apiQueryOptions(options),
  staleTime: 0, // ステータスの変更を即座に反映
})
export const meQueryOptions = <T extends object>(options: T) => ({
  ...freshQueryOptions(options),
  gcTime: Infinity,
  refetchOnMount: false,
})
export const eventsQueryOptions = <T extends object>(options: T) => ({
  ...apiQueryOptions(options),
  staleTime: 10 * 60 * 1000, // 10m
})
export const iconQueryOptions = <T extends object>(options: T) => ({
  ...options,
  staleTime: 24 * 60 * 60 * 1000, // 24h
  gcTime: 24 * 60 * 60 * 1000, // 24h
})
