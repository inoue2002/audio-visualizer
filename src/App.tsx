import { useEffect, useRef, useState } from 'react';
import './App.css';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useCanvasRecording } from './hooks/useCanvasRecording';
import { useRealtimeWaveform } from './hooks/useRealtimeWaveform';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    audioFile,
    isPlaying,
    handleFileChange,
    handlePlayClick,
    getAudioElement,
    resetAudio,
    playAudio,
    setOnEndedCallback,
  } = useAudioPlayer();
  const {
    isRecording,
    startRecording,
    stopRecording,
    supportedFormat,
    isConverting,
    conversionProgress,
    conversionStatus,
  } = useCanvasRecording(canvasRef, {
    frameRate: 30,
    fileName: 'canvas-recording',
    forceMP4: true,
    audioFile: audioFile || undefined,
  });
  const {
    frequencyData,
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    resetAnalysis,
    error: realtimeError,
  } = useRealtimeWaveform();

  // アクティブ範囲の追跡
  const [activeRange, setActiveRange] = useState<{ start: number; end: number }>({ start: 0, end: 127 });

  // デフォルトのビジュアルパラメータ
  const defaultVisualParams = {
    threshold: 24, // 動きの閾値
    minWidthRatio: 0.3, // 最小幅の係数
    waveformHeight: 313, // 波形の高さ
    targetBars: 211, // バーの数
    gapRatio: 1.0, // バー間隔の係数
    emphasisPower: 1.4, // 強調の係数
    minValue: 0.05, // 最小値
    heightRatio: 1.0, // 高さの係数
    colorMode: 'single' as 'rainbow' | 'single', // 色モード：虹色 or 単色
    singleColor: '#ffffff', // 単色の場合の色
    waveformPosition: 'center' as 'upper' | 'center' | 'lower', // 波形の表示位置
  };

  // パラメータの型定義
  type VisualParams = typeof defaultVisualParams;

  // ローカルストレージのキー
  const STORAGE_KEY = 'audio-visualizer-params';

  // ローカルストレージから設定を読み込む関数
  const loadParamsFromStorage = (): VisualParams => {
    try {
      const savedParams = localStorage.getItem(STORAGE_KEY);
      if (savedParams) {
        const parsed = JSON.parse(savedParams);
        // デフォルト値とマージして、新しいプロパティがあっても対応
        return { ...defaultVisualParams, ...parsed };
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
    return defaultVisualParams;
  };

  // 調整可能なパラメータ
  const [visualParams, setVisualParams] = useState<VisualParams>(loadParamsFromStorage);

  // パラメーター調整画面の展開状態
  const [showParameterPanel, setShowParameterPanel] = useState(false);

  // アコーディオンの各セクション状態
  const [helpSections, setHelpSections] = useState({
    basics: false,
    settings: false,
    troubleshoot: false,
  });

  // パラメータを保存する関数
  const saveParamsToStorage = (params: VisualParams) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch (error) {
      console.error('設定の保存エラー:', error);
    }
  };

  // デフォルト設定に戻す関数
  const resetToDefault = () => {
    setVisualParams(defaultVisualParams);
  };

  // アコーディオンセクションの切り替え関数
  const toggleHelpSection = (section: keyof typeof helpSections) => {
    setHelpSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // パラメータが変更されたときに自動保存
  useEffect(() => {
    saveParamsToStorage(visualParams);
  }, [visualParams]);

  // 音楽終了時のコールバック設定
  useEffect(() => {
    setOnEndedCallback(() => {
      if (isRecording) {
        console.log('音楽終了により録画を停止します');
        stopRecording();
      }
    });
  }, [isRecording, stopRecording, setOnEndedCallback]);

  // アクティブな周波数範囲を検出
  useEffect(() => {
    if (frequencyData && isPlaying) {
      const threshold = visualParams.threshold; // 動的に変更可能
      let firstActive = -1;
      let lastActive = -1;

      // 前から順に閾値を超える部分を探す
      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > threshold) {
          if (firstActive === -1) firstActive = i;
          lastActive = i;
        }
      }

      // アクティブ範囲が見つかった場合のみ更新
      if (firstActive !== -1 && lastActive !== -1) {
        // 範囲を少し広げて余裕を持たせる
        const margin = Math.floor((lastActive - firstActive) * 0.1);
        const start = Math.max(0, firstActive - margin);
        const end = Math.min(frequencyData.length - 1, lastActive + margin);

        // 最小幅を確保（画面全体を使うため）
        const minWidth = Math.floor(frequencyData.length * visualParams.minWidthRatio);
        if (end - start < minWidth) {
          const center = Math.floor((start + end) / 2);
          const newStart = Math.max(0, center - Math.floor(minWidth / 2));
          const newEnd = Math.min(frequencyData.length - 1, newStart + minWidth);
          setActiveRange({ start: newStart, end: newEnd });
        } else {
          setActiveRange({ start, end });
        }
      }
    }
  }, [frequencyData, isPlaying, visualParams.threshold, visualParams.minWidthRatio]);

  // 再生開始時にアクティブ範囲をリセット
  useEffect(() => {
    if (isPlaying) {
      setActiveRange({ start: 0, end: 127 });
    }
  }, [isPlaying]);

  // 再生状態が変化したときにリアルタイム解析を開始/停止
  useEffect(() => {
    const audioElement = getAudioElement();

    if (isPlaying && audioElement && !isAnalyzing) {
      startAnalysis(audioElement).catch(console.error);
    } else if (!isPlaying && isAnalyzing) {
      stopAnalysis();
    }
  }, [isPlaying, isAnalyzing, startAnalysis, stopAnalysis, getAudioElement]);

  // メインCanvasでのアニメーションループ
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (frequencyData && isPlaying) {
        // 実際の音声データを使用
        drawExpandedWaveform(ctx, frequencyData, canvas.width, canvas.height, activeRange, visualParams);
      } else {
        // モックデータを生成して表示
        const mockData = generateMockFrequencyData(startTime);
        const mockRange = { start: 0, end: mockData.length - 1 };
        drawExpandedWaveform(ctx, mockData, canvas.width, canvas.height, mockRange, visualParams);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [frequencyData, isPlaying, activeRange, visualParams]);

  // 拡張された波形を描画
  const drawExpandedWaveform = (
    ctx: CanvasRenderingContext2D,
    data: Uint8Array,
    canvasWidth: number,
    canvasHeight: number,
    range: { start: number; end: number },
    params: {
      threshold: number;
      minWidthRatio: number;
      waveformHeight: number;
      targetBars: number;
      gapRatio: number;
      emphasisPower: number;
      minValue: number;
      heightRatio: number;
      colorMode: 'rainbow' | 'single';
      singleColor: string;
      waveformPosition: 'upper' | 'center' | 'lower';
    }
  ) => {
    const waveformWidth = canvasWidth * 0.99;
    const waveformHeight = params.waveformHeight;
    const targetBars = params.targetBars;

    const startX = (canvasWidth - waveformWidth) / 2;

    // 波形位置に応じてstartYとcenterYを計算
    let startY: number;
    let centerY: number;

    switch (params.waveformPosition) {
      case 'upper':
        startY = canvasHeight * 0.15; // 上部15%の位置
        centerY = startY + waveformHeight / 2;
        break;
      case 'lower':
        startY = canvasHeight * 0.85 - waveformHeight; // 下部15%の位置（波形の高さを考慮）
        centerY = startY + waveformHeight / 2;
        break;
      case 'center':
      default:
        startY = (canvasHeight - waveformHeight) / 2;
        centerY = startY + waveformHeight / 2;
        break;
    }

    // 中央線
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX, centerY);
    ctx.lineTo(startX + waveformWidth, centerY);
    ctx.stroke();

    // アクティブ範囲のデータを抽出
    const activeData = Array.from(data).slice(range.start, range.end + 1);

    // バー幅を計算
    const barWidth = Math.max(2, Math.floor(waveformWidth / targetBars));
    const gap = Math.max(1, Math.floor(barWidth * params.gapRatio));

    // 補間してバー数を増やす
    const interpolatedData = interpolateData(activeData, targetBars);

    // アクティブデータの最大値を取得してスケーリング
    const maxInActiveData = Math.max(...interpolatedData);
    const minInActiveData = Math.min(...interpolatedData);
    const dataRange = Math.max(maxInActiveData - minInActiveData, 1);

    for (let i = 0; i < targetBars && i < interpolatedData.length; i++) {
      const value = interpolatedData[i];

      // 適度な正規化
      let normalizedValue = (value - minInActiveData) / dataRange;

      // 軽い強調に変更（0.6 → 0.8で自然に）
      normalizedValue = Math.pow(normalizedValue, params.emphasisPower);

      // 最小値を少し下げる（0.1 → 0.05）
      normalizedValue = Math.max(params.minValue, normalizedValue);

      // 適度な高さ計算（0.8 → 0.6に調整）
      const halfBarHeight = Math.max(2, (normalizedValue * waveformHeight * params.heightRatio) / 2);

      const x = startX + i * (barWidth + gap);

      // 適度なカラーグラデーション
      let color: string;

      if (params.colorMode === 'rainbow') {
        // 虹色の場合はHSLで色相を変化
        const hue = (i / targetBars) * 360;
        const saturation = 80 + normalizedValue * 20;
        const lightness = 30 + normalizedValue * 50;
        color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      } else {
        // 単色の場合は単色を使用
        color = params.singleColor;
      }

      ctx.fillStyle = color;

      // 通常の描画のみ（グロー効果を削除）
      ctx.fillRect(x, centerY - halfBarHeight, barWidth, halfBarHeight);
      ctx.fillRect(x, centerY, barWidth, halfBarHeight);
    }
  };

  // データを補間して滑らかに拡張
  const interpolateData = (sourceData: number[], targetLength: number): number[] => {
    if (sourceData.length === 0) return [];
    if (sourceData.length >= targetLength) return sourceData.slice(0, targetLength);

    const result: number[] = [];
    const ratio = (sourceData.length - 1) / (targetLength - 1);

    for (let i = 0; i < targetLength; i++) {
      const srcIndex = i * ratio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, sourceData.length - 1);
      const fraction = srcIndex - srcIndexFloor;

      // 線形補間
      const interpolatedValue = sourceData[srcIndexFloor] * (1 - fraction) + sourceData[srcIndexCeil] * fraction;
      result.push(interpolatedValue);
    }

    return result;
  };

  // モックの周波数データを生成
  const generateMockFrequencyData = (startTime: number): Uint8Array => {
    const time = (Date.now() - startTime) / 1000; // 秒単位の経過時間
    const dataLength = 128; // 標準的な周波数データの長さ
    const mockData = new Uint8Array(dataLength);

    for (let i = 0; i < dataLength; i++) {
      // 複数の波を組み合わせて自然な周波数スペクトラムを模擬
      const freq1 = Math.sin(time * 2 + i * 0.1) * 50;
      const freq2 = Math.sin(time * 3 + i * 0.05) * 30;
      const freq3 = Math.sin(time * 1.5 + i * 0.15) * 20;

      // 低周波数ほど振幅が大きい傾向を模擬
      const baseAmplitude = Math.max(0, 100 - i * 0.8);

      // ランダムなノイズを追加
      const noise = (Math.random() - 0.5) * 10;

      const value = baseAmplitude + freq1 + freq2 + freq3 + noise;
      mockData[i] = Math.max(0, Math.min(255, value));
    }

    return mockData;
  };

  const handlePlayAndRecordClick = async () => {
    if (!audioFile) {
      alert('音楽ファイルを選択してください');
      return;
    }

    try {
      await startRecording();
      await playAudio();
      console.log('🎵 再生&録画開始完了');
    } catch (error) {
      console.error('❌ 再生&録画開始エラー:', error);
      if (isRecording) {
        stopRecording();
      }
    }
  };

  const handleResetClick = () => {
    // 解析を停止してリセット
    resetAnalysis();
    // オーディオプレイヤーをリセット
    resetAudio();
    // アクティブ範囲もリセット
    setActiveRange({ start: 0, end: 127 });
  };

  return (
    <>
      {/* ヘッダー */}
      <header
        style={{
          padding: '1.5rem 2rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '2px solid #e9ecef',
          marginBottom: '2rem',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Audio Visualizer
        </h1>
        <p
          style={{
            margin: '0.5rem 0 0 0',
            fontSize: '1rem',
            color: '#6c757d',
            textAlign: 'center',
          }}
        >
          音楽に合わせたリアルタイムビジュアライザー
        </p>
      </header>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <input type="file" accept="audio/*" onChange={handleFileChange} style={{ marginRight: '1rem' }} />
          {audioFile && (
            <>
              <span style={{ marginRight: '1rem' }}>
                ファイル名: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
              <button onClick={handlePlayClick}>{isPlaying ? '一時停止' : '再生'}</button>
            </>
          )}
        </div>
        {realtimeError && <div style={{ color: 'red', marginBottom: '1rem' }}>エラー: {realtimeError}</div>}
        {isAnalyzing && (
          <div style={{ color: 'green', marginBottom: '1rem' }}>
            リアルタイム解析中... (範囲: {activeRange.start}-{activeRange.end})
          </div>
        )}
        {!isPlaying && !isAnalyzing && (
          <div style={{ color: 'blue', marginBottom: '1rem' }}>モックモード - パラメータ調整の効果をプレビュー中</div>
        )}
        {!isRecording ? (
          <button onClick={handlePlayAndRecordClick}>再生&録画開始</button>
        ) : (
          <button onClick={stopRecording}>録画停止</button>
        )}
        {audioFile && (
          <button onClick={handleResetClick} style={{ marginLeft: '1rem' }}>
            オーディオリセット
          </button>
        )}
        {isConverting && (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '1rem',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeeba',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '1rem', color: '#856404', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              🔄 {conversionStatus || 'MP4変換中...'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div
                style={{
                  width: '100%',
                  height: '20px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${conversionProgress}%`,
                    height: '100%',
                    backgroundColor:
                      conversionProgress >= 90 ? '#28a745' : conversionProgress >= 50 ? '#ffc107' : '#17a2b8',
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                    borderRadius: '10px',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#6c757d',
                  marginTop: '0.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>進行度: {conversionProgress}%</span>
                <span>
                  {conversionProgress < 15 ? '準備中...' : conversionProgress < 90 ? 'エンコード中...' : '仕上げ中...'}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#856404' }}>
              💡 初回変換時はFFmpeg.wasmのダウンロードで時間がかかる場合があります
            </div>
          </div>
        )}
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          録画形式: {supportedFormat}
          {audioFile ? ' (音声付き)' : ' (映像のみ)'}
        </div>
        <button
          onClick={() => setShowParameterPanel(!showParameterPanel)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem',
            backgroundColor: 'transparent',
            color: showParameterPanel ? '#4CAF50' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          title="パラメーター設定"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11.03L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11.03L19.5,12L19.43,12.97L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
          </svg>
        </button>
      </div>

      {/* 使い方セクション - 常に表示 */}
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
                  <strong>音楽ファイルを選択</strong> -
                  「ファイルを選択」ボタンからMP3、WAV等の音楽ファイルをアップロード
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

      {/* パラメータ調整UI - 条件付き表示 */}
      {showParameterPanel && (
        <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>ビジュアルパラメータ調整</h3>
            <button
              onClick={resetToDefault}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              デフォルトに戻す
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px' }}>
            <div>
              <label>動きの閾値: {visualParams.threshold}</label>
              <input
                type="range"
                min="1"
                max="50"
                value={visualParams.threshold}
                onChange={(e) => setVisualParams((prev) => ({ ...prev, threshold: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>波形の高さ: {visualParams.waveformHeight}</label>
              <input
                type="range"
                min="50"
                max="400"
                value={visualParams.waveformHeight}
                onChange={(e) => setVisualParams((prev) => ({ ...prev, waveformHeight: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>バーの数: {visualParams.targetBars}</label>
              <input
                type="range"
                min="50"
                max="500"
                value={visualParams.targetBars}
                onChange={(e) => setVisualParams((prev) => ({ ...prev, targetBars: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>バー間隔: {visualParams.gapRatio.toFixed(2)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={visualParams.gapRatio}
                onChange={(e) => setVisualParams((prev) => ({ ...prev, gapRatio: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>強調係数: {visualParams.emphasisPower.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={visualParams.emphasisPower}
                onChange={(e) => setVisualParams((prev) => ({ ...prev, emphasisPower: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>高さ係数: {visualParams.heightRatio.toFixed(2)}</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={visualParams.heightRatio}
                onChange={(e) => setVisualParams((prev) => ({ ...prev, heightRatio: Number(e.target.value) }))}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label>色モード</label>
              <select
                value={visualParams.colorMode}
                onChange={(e) =>
                  setVisualParams((prev) => ({ ...prev, colorMode: e.target.value as 'rainbow' | 'single' }))
                }
              >
                <option value="rainbow">虹色</option>
                <option value="single">単色</option>
              </select>
            </div>
            {visualParams.colorMode === 'single' && (
              <div>
                <label>単色: {visualParams.singleColor}</label>
                <input
                  type="color"
                  value={visualParams.singleColor}
                  onChange={(e) => setVisualParams((prev) => ({ ...prev, singleColor: e.target.value }))}
                />
              </div>
            )}
            <div>
              <label>波形の表示位置</label>
              <select
                value={visualParams.waveformPosition}
                onChange={(e) =>
                  setVisualParams((prev) => ({
                    ...prev,
                    waveformPosition: e.target.value as 'upper' | 'center' | 'lower',
                  }))
                }
              >
                <option value="upper">上部</option>
                <option value="center">中央</option>
                <option value="lower">下部</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            aspectRatio: '16/9',
          }}
        />
      </div>

      {/* フッター */}
      <footer
        style={{
          marginTop: '2rem',
          padding: '1rem',
          textAlign: 'center',
          borderTop: '1px solid #eee',
          color: '#666',
          fontSize: '0.9rem',
        }}
      >
        Created by inoue2002
      </footer>
    </>
  );
}

export default App;
