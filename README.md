# 🎵 Audio Visualizer

リアルタイム音声分析による高度なオーディオビジュアライザー

## ✨ 機能

- 🎶 **リアルタイム音声解析**: Web Audio APIを使用した高精度な周波数分析
- 🎨 **カスタマイズ可能な視覚化**: 波形の色、サイズ、エフェクトを自由に調整
- 📹 **動画録画**: FFmpegを使用してビジュアライザーの動画を生成・ダウンロード
- 📱 **レスポンシブデザイン**: デスクトップ・モバイル両対応のモダンUI
- ⚡ **リアルタイムプレビュー**: パラメータ変更時の即座な視覚フィードバック

## 🚀 クイックスタート

### 必要環境

- Node.js 18以上
- npm または yarn

### インストール・起動

```bash
# リポジトリをクローン
git clone https://github.com/inoue2002/audio-visualizer.git
cd audio-visualizer

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## 🎯 使い方

1. **音楽ファイルを選択**: 「音楽ファイルを選択」ボタンから任意のオーディオファイルをアップロード
2. **パラメーターを調整**: 「パラメーター設定」で波形の見た目をカスタマイズ
3. **プレビュー**: 再生ボタンでリアルタイムビジュアライザーをプレビュー
4. **録画**: 「再生&録画開始」で音楽と同期したビジュアライザー動画を生成

### 📹 録画機能

- **対応形式**: WebM（ブラウザ対応に応じてMP4への変換も可能）
- **解像度**: 1280×720 (HD)
- **フレームレート**: 30 FPS
- **音声**: 元のオーディオファイルと同期

### ⚙️ カスタマイズ可能なパラメーター

- **色設定**: メインカラー、グラデーション、背景色
- **波形調整**: 高さ、幅、スムージング
- **エフェクト**: グロー効果、透明度、アニメーション
- **レスポンシブ設定**: 周波数感度、表示範囲

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS

### UI コンポーネント
- **Radix UI** - アクセシブルなプリミティブ
- **Lucide React** - アイコンライブラリ
- **class-variance-authority** - 条件付きスタイリング

### 音声・動画処理
- **Web Audio API** - リアルタイム音声解析
- **Canvas API** - 高性能ビジュアライゼーション
- **FFmpeg.wasm** - ブラウザ内動画変換
- **MediaRecorder API** - 画面録画

## 📁 プロジェクト構造

```
src/
├── components/          # UIコンポーネント
│   ├── ui/             # 再利用可能なUIプリミティブ
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── Footer.tsx      # フッターコンポーネント
│   └── ...
├── hooks/              # カスタムフック
│   ├── useAudioPlayer.ts      # 音声再生管理
│   ├── useRealtimeWaveform.ts # リアルタイム解析
│   ├── useCanvasRecording.ts  # 動画録画
│   └── ...
├── utils/              # ユーティリティ関数
│   ├── visualizer.ts   # ビジュアライザー描画ロジック
│   ├── analytics.ts    # アナリティクス
│   └── ...
└── types/              # TypeScript型定義
    └── visualizer.ts
```

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# コードフォーマット・リント
npm run lint

# プレビュー（ビルド後）
npm run preview
```

### コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🙏 謝辞

- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - ブラウザ内動画処理
- [Radix UI](https://www.radix-ui.com/) - アクセシブルなUIコンポーネント
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS

---

**作者**: [inoue2002](https://github.com/inoue2002)