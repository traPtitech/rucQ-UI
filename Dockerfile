# Node.js のベースイメージを使用（LTS版）
FROM node:24.18.0-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.json の packageManager で指定した pnpm を有効化
RUN corepack enable

# package.json と pnpm-lock.yaml をコピー
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# ソースコードをコピー
COPY . .

# ビルド引数としてコミットハッシュを受け取る
ARG COMMIT_HASH

# 環境変数としてコミットハッシュを設定
ENV COMMIT_HASH=$COMMIT_HASH

# アプリケーションをビルド
RUN pnpm run build

# 本番用のCaddyイメージ
FROM caddy:2-alpine@sha256:6aeddd44c3078b0f9a35206472a11420648a79c184603ef95957d0a20044cb2b

# CaddyfileをコピーしてSPAルーティングを有効化
COPY Caddyfile /etc/caddy/Caddyfile

# ビルドされたファイルをCaddyの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/caddy

# ポート80を公開
EXPOSE 80

# Caddyを起動（Caddyfileを使用）
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
