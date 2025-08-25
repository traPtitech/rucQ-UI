# rucQ-UI

- サーバー：[traPtitech/rucQ](https://github.com/traPtitech/rucQ)
- ユーザー向けクライアント：here
- Admin 向けクライアント：[traPtitech/rucQ-Admin](https://github.com/traPtitech/rucQ-Admin)

## 環境構築

### 共通設定

1. Node.js をインストールする
2. `npm install` を実行して必要なモジュールを揃える

### MSW の Mock API を使う方法

クライアントからの HTTP リクエストを遮断して仮のレスポンスを返す MockServiceWorker を起動します。

1. `npm run dev` を実行する
2. <http://localhost:5173> にアクセスする

### リモートの Staging API を使う方法

クライアントが Staging API (<https://rucq-dev.trapti.tech/api>) にアクセスできるようにします。traQ 認証を突破するために Cookie をコピーしてくる必要があります。

1. <https://rucq-dev.trapti.tech/api/me> にアクセスする
2. Cookie 一覧から `_forward_auth` の値を取得する
3. `npm run dev:staging` を実行する
4. <http://localhost:5173> にアクセスし、Devtools で Cookie をセットする
    - Application タブ → Storage → Cookies → http://... にある
5. ページをリロードすると API との接続が確認できる

### API スキーマの更新

API の型定義 [schema.d.ts](./src/api/schema.d.ts) はバックエンド [rucQ](https://github.com/traPtitech/rucQ) の openapi.yaml から自動生成されます。もし openapi.yaml に更新があれば、`npm run generate:api` を実行して schema.d.ts を再生成してください。

## リリース

現状は以下の手順でやっています

1. main から `release/v1.X.X` という名前でブランチを生やす
2. その中で package.json のバージョンを書き換えて `npm install` を実行（自動で package-lock.json も書き換わる）
3. 以上を `release v1.X.X` という名前でコミット
4. main に対して PR を出してマージ
5. GitHub の UI 上でリリースを打つ。Generate release notes ボタンを押してリリース概要を自動生成
