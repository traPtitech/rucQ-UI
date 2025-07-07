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

# CaddyfileをコピーしてSPAルーティングを有効化
COPY Caddyfile /etc/caddy/Caddyfile

# ビルドされたファイルをCaddyの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/caddy

# ポート80を公開
EXPOSE 80

# Caddyを起動（Caddyfileを使用）
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
