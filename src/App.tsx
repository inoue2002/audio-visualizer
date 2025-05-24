import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ConversionProgress } from './components/ConversionProgress';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HelpSection } from './components/HelpSection';
import { ParameterPanel } from './components/ParameterPanel';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useCanvasRecording } from './hooks/useCanvasRecording';
import { useRealtimeWaveform } from './hooks/useRealtimeWaveform';
import { useVisualParams } from './hooks/useVisualParams';
import type { ActiveRange } from './types/visualizer';
import { trackPageView } from './utils/analytics';
import { generateMockFrequencyData } from './utils/mockData';
import { drawExpandedWaveform } from './utils/visualizer';

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

  // パラメータ管理
  const { visualParams, setVisualParams, resetToDefault } = useVisualParams();

  // アクティブ範囲の追跡
  const [activeRange, setActiveRange] = useState<ActiveRange>({ start: 0, end: 127 });

  // パラメーター調整画面の展開状態
  const [showParameterPanel, setShowParameterPanel] = useState(false);

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
      const threshold = visualParams.threshold;
      let firstActive = -1;
      let lastActive = -1;

      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > threshold) {
          if (firstActive === -1) firstActive = i;
          lastActive = i;
        }
      }

      if (firstActive !== -1 && lastActive !== -1) {
        const margin = Math.floor((lastActive - firstActive) * 0.1);
        const start = Math.max(0, firstActive - margin);
        const end = Math.min(frequencyData.length - 1, lastActive + margin);

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
        drawExpandedWaveform(ctx, frequencyData, canvas.width, canvas.height, activeRange, visualParams);
      } else {
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

  // Google Analytics - ページビュー追跡
  useEffect(() => {
    trackPageView('Audio Visualizer - メインページ');
  }, []);

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
    resetAnalysis();
    resetAudio();
    setActiveRange({ start: 0, end: 127 });
  };

  return (
    <>
      <Header />

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

        <ConversionProgress
          isConverting={isConverting}
          conversionProgress={conversionProgress}
          conversionStatus={conversionStatus}
        />

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

      <HelpSection />

      {showParameterPanel && (
        <ParameterPanel visualParams={visualParams} setVisualParams={setVisualParams} resetToDefault={resetToDefault} />
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

      <Footer />
    </>
  );
}

export default App;
