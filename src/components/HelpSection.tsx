import { useState } from 'react';
import type { HelpSections } from '../types/visualizer';

export const HelpSection = () => {
  const [helpSections, setHelpSections] = useState<HelpSections>({
    basics: false,
    settings: false,
    troubleshoot: false,
  });

  const toggleHelpSection = (section: keyof HelpSections) => {
    setHelpSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div
      style={{
        marginBottom: '1rem',
        border: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3
        style={{
          margin: '0',
          padding: '1rem 1.5rem',
          color: '#2c3e50',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          borderBottom: '1px solid #ddd',
        }}
      >
        📖 使い方
      </h3>

      {/* アコーディオンセクション1: 基本的な使い方 */}
      <div style={{ borderBottom: '1px solid #eee' }}>
        <button
          onClick={() => toggleHelpSection('basics')}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#343a40',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          🎵 基本的な使い方
          <span
            style={{
              transform: helpSections.basics ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▶
          </span>
        </button>
        {helpSections.basics && (
          <div style={{ padding: '0 1.5rem 1rem 1.5rem', fontSize: '0.95rem', lineHeight: '1.6', color: '#495057' }}>
            <ol style={{ margin: '0', paddingLeft: '1.5rem' }}>
              <li>
                <strong>音楽ファイルを選択</strong> - 「ファイルを選択」ボタンからMP3、WAV等の音楽ファイルをアップロード
              </li>
              <li>
                <strong>再生&録画開始</strong> - ボタンをクリックすると音楽再生とビジュアライザーの録画が同時に開始
              </li>
              <li>
                <strong>自動完了</strong> - 音楽が終わると自動的に録画が停止され、動画ファイルがダウンロード
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* アコーディオンセクション2: 設定とカスタマイズ */}
      <div style={{ borderBottom: '1px solid #eee' }}>
        <button
          onClick={() => toggleHelpSection('settings')}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#343a40',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          ⚙️ 設定とカスタマイズ
          <span
            style={{
              transform: helpSections.settings ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▶
          </span>
        </button>
        {helpSections.settings && (
          <div style={{ padding: '0 1.5rem 1rem 1.5rem', fontSize: '0.95rem', lineHeight: '1.6', color: '#495057' }}>
            <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
              <li>
                <strong>パラメーター調整</strong> - ⚙️ボタンで詳細設定を開き、波形の高さ、バーの数、色などを調整
              </li>
              <li>
                <strong>色の選択</strong> - 虹色または単色から選択可能
              </li>
              <li>
                <strong>設定の保存</strong> - 調整した設定は自動的に保存され、次回起動時に復元
              </li>
              <li>
                <strong>デフォルトに戻す</strong> - 設定パネル内のボタンで初期設定に戻せます
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* アコーディオンセクション3: トラブルシューティング */}
      <div>
        <button
          onClick={() => toggleHelpSection('troubleshoot')}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#343a40',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          🔧 トラブルシューティング
          <span
            style={{
              transform: helpSections.troubleshoot ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            ▶
          </span>
        </button>
        {helpSections.troubleshoot && (
          <div style={{ padding: '0 1.5rem 1rem 1.5rem', fontSize: '0.95rem', lineHeight: '1.6', color: '#495057' }}>
            <ul style={{ margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
              <li>
                <strong>音が出ない</strong> - ブラウザの音量設定を確認してください
              </li>
              <li>
                <strong>再生エラー</strong> - 「オーディオリセット」ボタンでリセットしてから再試行
              </li>
              <li>
                <strong>録画できない</strong> - ブラウザが最新版かご確認ください（Chrome、Firefox推奨）
              </li>
            </ul>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '4px',
                border: '1px solid #bbdefb',
              }}
            >
              <strong>💡 ヒント:</strong> モックモード（音楽未選択時）でパラメーターの効果をプレビューできます
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
