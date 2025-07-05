# Node.js のベースイメージを使用（LTS版）
FROM node:22-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 本番用のCaddyイメージ
FROM caddy:2-alpine

# ビルドされたファイルをCaddyの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/caddy

# ポート80を公開
EXPOSE 80

# Caddyを起動
CMD ["caddy", "file-server", "--root", "/usr/share/caddy"]