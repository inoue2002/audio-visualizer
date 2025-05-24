import { useEffect, useRef } from 'react';
import './App.css';
import { RealtimeWaveform } from './components/RealtimeWaveform';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useCanvasRecording } from './hooks/useCanvasRecording';
import { useRealtimeWaveform } from './hooks/useRealtimeWaveform';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isRecording, startRecording, stopRecording } = useCanvasRecording(canvasRef, {
    frameRate: 30,
    fileName: 'canvas-recording',
  });
  const { audioFile, isPlaying, handleFileChange, handlePlayClick, getAudioElement } = useAudioPlayer();
  const { frequencyData, isAnalyzing, startAnalysis, stopAnalysis, error: realtimeError } = useRealtimeWaveform();

  // 再生状態が変化したときにリアルタイム解析を開始/停止
  useEffect(() => {
    const audioElement = getAudioElement();

    if (isPlaying && audioElement && !isAnalyzing) {
      startAnalysis(audioElement).catch(console.error);
    } else if (!isPlaying && isAnalyzing) {
      stopAnalysis();
    }
  }, [isPlaying, isAnalyzing, startAnalysis, stopAnalysis, getAudioElement]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスのサイズを設定
    canvas.width = 1280;
    canvas.height = 720;

    // アニメーションループ
    let animationFrameId: number;
    const animate = () => {
      // 背景を描画（グリーンバック）
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleRecordClick = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('録画開始エラー:', error);
    }
  };

  return (
    <>
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
        {isAnalyzing && <div style={{ color: 'green', marginBottom: '1rem' }}>リアルタイム解析中...</div>}
        {!isRecording ? (
          <button onClick={handleRecordClick}>録画開始</button>
        ) : (
          <button onClick={stopRecording}>録画停止</button>
        )}
      </div>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            aspectRatio: '16/9',
          }}
        />
        {frequencyData && isPlaying && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <RealtimeWaveform
              frequencyData={frequencyData}
              width={600}
              height={120}
              barWidth={5}
              gap={2}
              style="bars"
              backgroundColor="rgba(0, 0, 0, 0.7)"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
