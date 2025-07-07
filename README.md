# rucQ-UI

- Server: [traPtitech/rucQ](https://github.com/traPtitech/rucQ)
- Client: here

## 環境構築

### 共通設定

1. Node.jsをインストールする
2. `npm install` を実行する

### MSWのMock APIを使う方法

1. `npm run dev` を実行する
2. <http://localhost:5173> にアクセスする

### リモートのStaging APIを使う方法 (Default)

traQ 認証を突破するためにCookieをコピーしてくる必要があるためその方法を説明します。

1. <https://rucq-dev.trap.show/api/me> にアクセスする
2. Cookie一覧から `_forward_auth` の値を取得する
3. `npm run dev:staging` を実行する
4. <http://localhost:5173> にアクセスし、DevtoolsでCookieをセットする
    - Applicationタブ → Storage → Cookies → http://... にある
5. ページをリロードするとAPIとの接続が確認できる

