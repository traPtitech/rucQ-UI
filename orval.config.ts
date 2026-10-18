import { defineConfig } from 'orval'

const policy = (name: string) => ({
  queryOptions: { path: './src/api/queryOptions.ts', name, useHooks: false },
})

export default defineConfig({
  api: {
    input: {
      target: 'https://raw.githubusercontent.com/traPtitech/rucQ/main/openapi.yaml',
      override: {
        transformer: (spec) => {
          // SSE 周りの生成は型にバグがありビルドが失敗する。そのため生成から除いておく。
          if (spec.paths) delete spec.paths['/api/roll-calls/{rollCallId}/reactions/stream']
          return spec
        },
      },
    },
    output: {
      target: './src/api/generated/client.ts',
      client: 'vue-query',
      httpClient: 'fetch',
      mode: 'split',
      clean: true,
      override: {
        fetch: { includeHttpResponseReturnType: false, forceSuccessResponse: true },
        query: { version: 5, ...policy('apiQueryOptions') },
        // API ごとの例外。 staleTime / gcTime などキャッシュ設定はここに書く
        operations: {
          getMe: {
            // api/meの実行時に現在認証を行っているので、これはリダイレクトをmanualにしてService Workerの管理外の/loginに手動でリダイレクトする
            requestOptions: { redirect: 'manual' },
            // レスポンスが生成コードで変換される前に authFetch で opaqueredirect を判定する。
            fetch: { useRuntimeFetcher: true },
            query: policy('meQueryOptions'),
          },
          getEvents: { query: policy('eventsQueryOptions') },
          getActivities: { query: policy('freshQueryOptions') },
          getRoomGroups: { query: policy('freshQueryOptions') },
          getRoomStatusLogs: { query: policy('freshQueryOptions') },
          getRollCalls: { query: policy('freshQueryOptions') },
          getRollCallReactions: { query: policy('freshQueryOptions') },
        },
      },
    },
  },
})
