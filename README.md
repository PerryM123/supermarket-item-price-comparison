# いくらだったっけ？！

※ [English README.md is here！](/docs/README-english.md)👈

近くのスーパーの商品価格を簡単に比較するアプリです。

![アプリの流れと機能を紹介する動画](/docs/images/movie.gif)

## 機能一覧

- 各スーパーの商品価格を比較・確認
- 商品とスーパーの追加・編集・閲覧
- 商品ごとにスーパーの価格を比較

## Getting Started

### 事前準備

- [Docker](https://docs.docker.com/get-docker/) と Docker Compose

### hostsファイルにローカルドメインを追加

```sh
# /etc/hosts
127.0.0.1 local.super-price-check.com
```

### ローカル環境の構築方法

```sh
git clone <repo-url>
cd supermarket-item-price-comparison

# 環境ファイルのコピー
cp .env.example .env
cp ./frontend/.env.example .env
cp ./backend/.env.example .env

# 全コンテーナを起動
make up
```

**http://local.super-price-check.com:8082** または **http://localhost:8082** でアクセスできます

## アーキテクチャ

### 主要技術

#### フロントエンド
- React 19 + TypeScript
- TanStack Router
- TanStack Query
- Tailwind CSS v4
- Vite

#### バックエンド
- Laravel 13（PHP 8.3）
- PostgreSQL 16
- Garage（S3互換オブジェクトストレージ）

#### テスト
- Vitest
- Playwright（E2E）

### ディレクトリ構成

```
supermarket-item-price-comparison/
├── frontend/                  # React + TypeScript SPA
│   └── app/
│       ├── features/          # フィーチャーモジュール（商品、スーパー）
│       ├── routes/            # ルートまとめ（TanStack Router）
│       ├── components/        # 共有UIコンポーネント
│       └── lib/               # ユーティリティとAPIクライアント
├── backend/                   # Laravel REST API
│   ├── app/Http/Controllers/  # コントローラー
│   ├── database/migrations/   # PostgreSQLスキーマ
│   └── routes/api.php         # APIルート定義
├── docker/                    # 各サービスのDockerfile
├── nginx/                     # プロキシ設定
├── tests/                     # E2Eテストヘルパー
├── docs/                      # API仕様書
├── docker-compose.yml         
├── docker-compose.production.yml
└── Makefile                   # ローカル用のコマンドまとめ
```

## サービスまとめ

| サービス | 説明 | ポート |
|---|---|---|
| nginx | リバースプロキシ — `/api` をバックエンドへ、その他をフロントエンドへルーティング | 8082 |
| frontend | React開発サーバー（Vite） | internal |
| backend | Laravel API | internal |
| postgres | メインデータベース | 5432 |
| garage | S3互換オブジェクトストレージ | 3900 |

## 便利なコマンドまとめ

| コマンド | 説明 |
|---|---|
| `make up` | 全コンテーナーを起動 |
| `make down` | 全コンテーナーを停止 |
| `make build` | 全コンテーナーをビルドして起動 |
| `make laravel` | バックエンドコンテナ内でシェルを開く |
| `make laravel-migrate` | データベースマイグレーションを実行 |
| `make laravel-migrate-seed` | マイグレーションとシードデータを実行 |
| `make laravel-logs` | バックエンドログをtail表示 |

## API仕様書（ローカル環境）

```sh
make docs
```

http://local.super-price-check.com:9090 または http://localhost:9090 でアクセスできます

![アプリのAPIドキュメント](/docs/images/swagger-docs.png)
