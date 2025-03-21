# rucQ-UI

### 準備

-  rucQ/frontend で `npm i` を実行して必要なnodeモジュールをインストール
-  rucQ/backend で `go mod tidy` を実行して必要なgoモジュールをインストール
-  Docker を開いておく

### 起動

1. rucQ（ルート）で `docker compose up -d` を実行 → コンテナをバックグラウンドで起動
2. rucQ で `go backend/main.go` を実行 → バックエンドを起動（ Swagger: http://localhost:8081/ ）
3. rucQ/frontend で `npm run dev` を実行 → フロントエンドを起動（ http://localhost:5173/ ）

### Swaggerで初期情報を登録

以下、X-Forwarded-User には常にユーザー自身のIDを入れる

1. `/api/staff` にPOSTして自分を合宿係に追加
2. `/api/camps` にPOSTして適当な合宿を作成
