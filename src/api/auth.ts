export const authFetch: typeof fetch = async (input, options) => {
  const response = await fetch(input, options)

  // Temporary Redirect の場合、手動でリダイレクト処理を行う
  if (response.type === 'opaqueredirect') {
    if (import.meta.env.DEV) {
      // 開発環境の場合、/login にリダイレクトしても traQ 認証が挟まるわけではない
      // 無限ループしてしまうので、Cookie が適切に設定されているかどうかの確認を求め、
      // ここでアプリケーションを終了する
      alert(
        '開発環境から Staging / Production API へのアクセスを試み、ログインに失敗しました。Cookie が環境変数として正しく設定されていないか、古すぎる可能性があります。',
      )
      return new Promise<never>(() => {
        // アプリの初期化を中断
      })
    }

    window.location.href = '/login'
    return new Promise<never>(() => {
      // ユーザーにエラー表示をさせないよう、解決しない Promise を返す
    })
  }

  return response
}
