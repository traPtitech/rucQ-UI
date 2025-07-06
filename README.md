# rucQ-UI

- Server: [traPtitech/rucQ](https://github.com/traPtitech/rucQ)
- Client: here

## 環境構築

### 共通設定

1. Node.jsをインストールする
2. `.env.example` を `.env` にコピーする
3. `npm install` を実行する

### リモートのStaging APIを使う方法 (Default)

traQ 認証を突破するためにCookieをコピーしてくる必要があるためその方法を説明します。

1. <https://rucq-dev.trap.show/api/me> にアクセスする
2. Cookie一覧から `_forward_auth` の値を取得する
3. `npm run dev` を実行する
4. <http://localhost:5173> にアクセスし、DevtoolsでCookieをセットする
    - Applicationタブ → Storage → Cookies → http://... にある
5. ページをリロードするとAPIとの接続が確認できる

### ローカルで建てたAPIを使う方法

1. `.env` の `RUCQ_API_PROXY_URL` を対象のサーバーのURLに変更する
    ```bash
    RUCQ_API_PROXY_URL="http://localhost:サーバーのポート"
    ```
2. `npm run dev` を実行する
3. <http://localhost:5173> にアクセスする
