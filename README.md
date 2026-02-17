# rucQ-UI

- サーバー：[traPtitech/rucQ](https://github.com/traPtitech/rucQ)
- ユーザー向けクライアント：here
- Admin 向けクライアント：[traPtitech/rucQ-Admin](https://github.com/traPtitech/rucQ-Admin)

## 準備

[Web エンジニアになろう講習会](https://traptitech.github.io/naro-text/chapter1/) に従って環境構築をした場合、fnm（Node.js のバージョン管理ツール）が手元にあるはず
1. リポジトリルートをターミナルで開いて `fnm use --install-if-missing` を実行
2. `node -v` を実行して `v22.22.0` と表示されることを確認
3. `corepack enable && pnpm -v` を実行して `10.28.2` と表示されることを確認

## 起動

`pnpm i` でフロントエンドの起動に必要な Node モジュールをインストールしてください。

### MSW の Mock API を使う方法

クライアントからの HTTP リクエストを遮断して仮のレスポンスを返す MockServiceWorker を起動します。

1. フロントエンドを起動 `pnpm dev:msw`
2. <http://localhost:5173> にアクセス

起動は不安定であり、とくに初回は 2, 3 回のリロードを必要とする場合があります。

### Staging / Production API を使う方法

開発環境から Staging API（<https://rucq-dev.trapti.tech/api>）または Production API（<https://rucq.trap.jp/api>）にアクセスします。traQ 認証を突破するために Cookie をコピーしてくる必要があります。

**注意: 本番環境は実際のデータを使用しているため、閲覧以外の操作はなるべく行わないでください。データが実際に書き換わります。**

1. [Staging](https://rucq-dev.trapti.tech/api/me) または [Production](https://rucq.trap.jp/api/me) にアクセスする
2. DevTool のアプリケーションタブを開き、Cookie 一覧から `_forward_auth` の値を取得する
3. 空のテキストファイル `.env.local` をルートに作成して以下の内容を書き込む
   ```sh
   STAGING_COOKIE="_forward_auth=xxxx" # Staging 用
   PRODUCTION_COOKIE="_forward_auth=xxxx" # Production 用
   ```
   ※ `_forward_auth=` から始まる値をそのまま貼り付けてください。

4. フロントエンドを起動
   - Staging: `pnpm dev:staging`
   - Production: `pnpm dev:prod`
5. <http://localhost:5173> にアクセス

### ビルドとプレビュー（オフライン動作の確認）

ビルドしてプレビューすることで、Service Worker（PWA）を含む本番相当の挙動を確認できます。特に**オフライン時の挙動**を確認したい場合はこの手順を行ってください。

1. ビルドする
   `pnpm build`
2. プレビューを起動
   - Staging: `pnpm preview:staging`
   - Production: `pnpm preview:prod`
3. <http://localhost:4173> にアクセス（ポート番号が 5173 ではない点に注意）

### ローカルでバックエンドを起動する方法

とくに必要がなければ基本的に Mock API または Staging API を使用してください。

1. バックエンドをローカルで起動 `docker compose up --build`
2. rucQ-Admin（<http://localhost:3003>）から @traq を合宿係に追加
3. rucQ-Admin 上で合宿を作成して下書き設定を解除し、参加登録を受け付ける
4. フロントエンドを起動 `pnpm dev`
5. <http://localhost:5173> にアクセス

バックエンドをローカルに立てると自動で traQ も立ち上がります。@traq はデフォルトで traQ に存在するユーザーアカウントです。

## API スキーマの更新

API の型定義 [schema.d.ts](./src/api/schema.d.ts) はバックエンド [rucQ](https://github.com/traPtitech/rucQ) の openapi.yaml から自動生成されます。もし openapi.yaml に更新があれば、`pnpm generate:api` を実行して schema.d.ts を再生成してください。

## リリース

現状は以下の手順でやっています。

1. main から `release/v1.X.X` という名前でブランチを生やす
2. その中で package.json のバージョンを書き換えて `release v1.X.X` という名前でコミット
3. main に対して PR を出してマージ
4. GitHub の UI 上でリリースを打つ。Generate release notes ボタンを押してリリース概要を自動生成
5. [manifest](https://github.com/traPtitech/manifest/pulls) からリリース用の PR（自動で立てられる）を探す
6. 自分にレビューをリクエストし、Approve、マージ
