# 🎵 Audio Visualizer

音楽に合わせたリアルタイムビジュアライザー & 動画作成ツール

[![Deploy to GitHub Pages](https://github.com/inoue2002/audio-visualizer/actions/workflows/deploy.yml/badge.svg)](https://github.com/inoue2002/audio-visualizer/actions/workflows/deploy.yml)

## 🌟 概要

Audio Visualizerは、音声ファイルをアップロードして美しい波形ビジュアライゼーションを生成できるWebアプリケーションです。生成されたビジュアライゼーションは動画として録画・ダウンロードでき、動画編集に最適なグリーンスクリーン背景で出力されます。

### ✨ 主な機能

- 🎵 **音声ファイル対応**: MP3、WAV、AAC等の主要音声形式をサポート
- 🎨 **カスタマイズ可能**: 波形の色、形、位置、バーの数など詳細にカスタマイズ
- 🎬 **動画録画**: 音声付きMP4形式で高品質録画
- 🟢 **グリーンスクリーン**: 動画編集に最適な背景色
- 📱 **レスポンシブ**: PC・タブレット・スマートフォン対応
- ⚡ **リアルタイム**: 音楽再生に同期したリアルタイム描画
- 💾 **設定保存**: カスタム設定の自動保存・復元

## 🚀 デモ

**[📱 今すぐ試す](https://inoue2002.github.io/audio-visualizer/)**

## 📖 使い方

### 基本的な使い方

1. **音楽ファイルを選択**  
   「🎵 音楽ファイルを選択」から音声ファイルをアップロード

2. **プレビュー**  
   設定を調整しながらリアルタイムでプレビュー確認

3. **録画開始**  
   「🔴 再生&録画開始」ボタンで音楽再生と録画を同時開始

4. **自動完了**  
   音楽終了と同時に録画停止、MP4ファイルが自動ダウンロード

### 詳細設定

#### 波形パラメーター
- **動きの閾値**: 反応する音量レベルの調整
- **波形の高さ**: バーの最大高さ
- **バーの数**: 表示するバーの本数（50-500）
- **バー間隔**: バー同士の間隔
- **強調係数**: 音量変化の強調度
- **高さ係数**: 全体的な高さの調整

#### 見た目のカスタマイズ
- **色モード**: 🌈虹色 または 🎨単色から選択
- **単色設定**: カラーピッカーで自由な色選択
- **表示位置**: ⬆️上部・🎯中央・⬇️下部から選択

## 🎯 活用シーン

### 動画編集
- **グリーンスクリーン背景**で簡単クロマキー合成
- **音楽PV**や**プレゼンテーション**の背景として
- **ライブ配信**の演出効果として

### コンテンツ制作
- **YouTube動画**の視覚効果
- **ポッドキャスト**の音声可視化
- **音楽作品**のプロモーション素材

## 🛠️ 技術仕様

### フロントエンド
- **React 18** + **TypeScript**
- **Vite** (ビルドツール)
- **Tailwind CSS** + **shadcn/ui** (UI)
- **Web Audio API** (音声解析)
- **Canvas API** (リアルタイム描画)
- **MediaRecorder API** (録画)

### 動画処理
- **FFmpeg.wasm** (WebM→MP4変換)
- **音声・映像合成**対応
- **高品質エンコード** (H.264/AAC)

### その他
- **Google Analytics 4** (使用状況分析)
- **GitHub Pages** (ホスティング)
- **PWA対応** (オフライン動作)

## 📊 対応環境

### ブラウザ
- ✅ **Chrome** 88+ (推奨)
- ✅ **Firefox** 90+
- ✅ **Safari** 14+
- ✅ **Edge** 88+

### 音声形式
- ✅ **MP3** (.mp3)
- ✅ **WAV** (.wav)
- ✅ **AAC** (.aac, .m4a)
- ✅ **OGG** (.ogg)
- ✅ **FLAC** (.flac)

### 出力形式
- 🎬 **MP4** (H.264 + AAC)
- 📺 **1280×720** (HD解像度)
- 🎞️ **30fps** (滑らかな動画)

## ⚙️ 開発・ビルド

### 前提条件
- **Node.js** 18+
- **npm** 8+

### 開発環境起動
```bash
# リポジトリクローン
git clone https://github.com/inoue2002/audio-visualizer.git
cd audio-visualizer

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

### ビルド
```bash
# 本番ビルド
npm run build

# プレビュー
npm run preview
```

### 主要な依存関係
```json
{
  "@ffmpeg/ffmpeg": "^0.12.7",
  "react": "^18.3.1",
  "typescript": "^5.7.2",
  "tailwindcss": "^4.0.0",
  "vite": "^6.3.5"
}
```

## 🔒 プライバシー

このアプリケーションは、サービス改善のために以下のデータを収集します：

- 📊 **ページビュー数**
- 🎵 **機能使用状況** (匿名)
- ❌ **エラー発生率**
- 🌍 **地域統計** (国レベル)

**詳細**: [プライバシーポリシー](./PRIVACY.md)

### データの取り扱い
- 🔒 **音声ファイル**: ローカル処理のみ、サーバー送信なし
- 🚫 **個人情報**: 収集・保存一切なし
- 📈 **分析データ**: Google Analytics 4使用、匿名化済み

## 📄 ライセンス

MIT License - 詳細は [LICENSE](./LICENSE) ファイルをご確認ください。

## 🤝 コントリビューション

Issue報告・プルリクエスト大歓迎です！

### 開発に参加
1. **Fork**してローカルクローン
2. **機能ブランチ**作成 (`git checkout -b feature/amazing-feature`)
3. **変更をコミット** (`git commit -m 'Add amazing feature'`)
4. **ブランチにプッシュ** (`git push origin feature/amazing-feature`)
5. **Pull Request**作成

## 🙏 謝辞

- **FFmpeg.wasm** - 音声・動画処理
- **Web Audio API** - リアルタイム音声解析
- **shadcn/ui** - モダンUIコンポーネント
- **Tailwind CSS** - ユーティリティファーストCSS

## 📞 サポート

- 🐛 **バグ報告**: [GitHub Issues](https://github.com/inoue2002/audio-visualizer/issues)
- 💡 **機能要望**: [GitHub Discussions](https://github.com/inoue2002/audio-visualizer/discussions)
- 📧 **その他**: [Contact](mailto:your-email@example.com)

---

**Made with ❤️ by [inoue2002](https://github.com/inoue2002)**
