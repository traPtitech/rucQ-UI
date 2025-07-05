# rucQ-UI

- Server: [traPtitech/rucQ](https://github.com/traPtitech/rucQ)
- Client: here

## 環境構築

- Node.js
- Docker

### リモートのStaging APIを使う方法 (Default)

traQ 認証を突破するためにCookieをコピーしてくる必要があります。

1. <https://rucq-dev.trap.show/api/me> にアクセスする
2. Cookie一覧から `_forward_auth` の値を取得する
3. `docker compose up --build -d` を実行する
4. <http://localhost:5173> にアクセスし、DevtoolsでCookieをセットする
  - Applicationタブ → Storage → Cookies → http://... にある
5. ページをリロードするとAPIとの接続が確認できる

### ローカルで建てたAPIを使う方法

1. `.env` に以下を記述

```bash
VITE_API_BASE_URL="http://localhost:サーバーのポート"
```

2. `docker compose up --build -d` を実行する
3. <http://localhost:5173> にアクセスする
