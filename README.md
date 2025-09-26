# 画像検索アプリケーション (image-search)

## 概要

キーワードで画像を検索するためのWebアプリケーション。
このREADMEは、将来の自分自身がプロジェクトの構成を思い出し、スムーズに開発を再開できるようにするための備忘録です。

## ✨ 主な機能

-   キーワードによる画像検索

## 🛠️ 技術スタック

このプロジェクトで使用している主要な技術は以下の通りです。

-   **フロントエンド**:
    -   **React**: UIライブラリ
    -   **TypeScript**: 静的型付け
    -   **Tailwind CSS**: CSSフレームワーク
    -   **shadcn/ui**: UIコンポーネント
    -   **Firebase SDK**: 認証基盤(Firebase Authentication)連携
-   **バックエンド**:
    -   **Python**: 
    -   **Flask**: Webアプリフレームワーク
    -   **Firebase Admin**: 認証基盤(Firebase Authentication)連携
    -   **Google Custom Search API**: 画像検索エンジン(要、別途セットアップ)
-   **インフラストラクチャ**:
    -   **Google Cloud Run**: ホスティングサービス
    -   **Firebase Authentication**: 認証基盤
-   **ビルドツール / パッケージ管理**:
    -   **npm**: パッケージマネージャー
    -   **vite**: ビルドツール

## 📁 ディレクトリ構成

```
image-search/
├── backend      # バックエンドのPythonコード
├── dist         # リリース用の作業場。Dockerfileとか
└── frontend     # フロントエンドのTsコード
    ├── dist
    └── src
        ├── assets
        ├── components
        │   └── ui
        ├── contexts
        ├── hooks
        └── lib
```

## 🚀 環境構築と開発手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/<あなたのユーザー名>/image-search.git
cd image-search
```

### 2. 依存パッケージのインストール

フロントエンドの作業ディレクトリに移動し、`npm` を使って必要なパッケージをインストールします。

```bash
cd frontend
npm install
```

### 3. 環境変数の設定

Firebaseプロジェクトに接続するための認証情報が必要です。`frontend` ディレクトリのルートに `.env` ファイルを作成し、以下の内容を記述してください。

**【重要】** `.env` ファイルは `.gitignore` に記載されているため、Gitの管理対象外です。APIキーなどの機密情報を含めるため、絶対にコミットしないでください。

```env
# .env (frontend/ ディレクトリに作成)

# Firebaseプロジェクトの設定情報
# 使用しているビルドツールに合わせてプレフィックスを修正してください。

VITE_API_KEY="YOUR_FIREBASE_API_KEY"
VITE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
VITE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
VITE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
VITE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
VITE_APP_ID="YOUR_FIREBASE_APP_ID"
```
> **Note**: これらの値は、Firebaseコンソールのプロジェクト設定画面（⚙️ > プロジェクトの設定）で確認できます。

### 4. 開発サーバーの起動

以下のコマンドで、ローカル開発用サーバーを起動します。

```bash
# frontend/ ディレクトリで実行
npm run dev
```

ターミナルに表示されたローカルアドレス (例: `http://localhost:5173`) にブラウザでアクセスすると、アプリケーションが表示されます。

## 🔥 デプロイ

このプロジェクトはGoogle Cloud Run + Firebase Authenticationで実行することを想定しています。

### 1. Google Cloudへのログイン

初回のみ、またはセッションが切れている場合に実行が必要です。
```bash
gcloud auth login --no-browser
```

### 2. リリース用ファイルの準備

リポジトリのルートディレクトリで以下のコマンドを実行します。
```bash
cd dist
./build.sh
```

### 3. デプロイの実行

リポジトリのルートディレクトリで以下のコマンドを実行します。
```bash
cd dist/app
../deploy.sh
```

```bash
cd app && gcloud run deploy ${YOUR_APP_NAME} \
	--source . \
	--platform managed \
	--region asia-east1 \
	--allow-unauthenticated \
	--set-secrets GOOGLE_API_KEY=GOOGLE_API_KEY:latest,GOOGLE_CSE_ID=GOOGLE_CSE_ID:latest
```
