# Node.js のベースイメージを使用（LTS版）
FROM node:22-alpine@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS builder

# 作業ディレクトリを設定
WORKDIR /app

# pnpm をインストール
RUN npm install -g pnpm@11.5.0

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
FROM caddy:2-alpine@sha256:86deaf5e3d3408a6ccec08fbb79989783dd26e206ae10bcf78a801dc8c9ab794

# CaddyfileをコピーしてSPAルーティングを有効化
COPY Caddyfile /etc/caddy/Caddyfile

# ビルドされたファイルをCaddyの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/caddy

# ポート80を公開
EXPOSE 80

# Caddyを起動（Caddyfileを使用）
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
