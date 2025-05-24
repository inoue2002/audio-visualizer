import { useEffect, useRef } from 'react';
import './App.css';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useCanvasRecording } from './hooks/useCanvasRecording';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isRecording, startRecording, stopRecording } = useCanvasRecording(canvasRef, {
    frameRate: 30,
    fileName: 'canvas-recording',
  });
  const { audioFile, isPlaying, handleFileChange, handlePlayClick } = useAudioPlayer();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスのサイズを設定
    canvas.width = 1280;
    canvas.height = 720;

    // ランダムな色を生成する関数
    const getRandomColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    };

    let lastColorChange = Date.now();
    let currentColor = getRandomColor();

    // アニメーションループ
    let animationFrameId: number;
    const animate = () => {
      const now = Date.now();

      // 0.5秒ごとに色を変更
      if (now - lastColorChange >= 500) {
        currentColor = getRandomColor();
        lastColorChange = now;
      }

      // キャンバスに描画
      ctx.fillStyle = currentColor;
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
        {!isRecording ? (
          <button onClick={handleRecordClick}>録画開始</button>
        ) : (
          <button onClick={stopRecording}>録画停止</button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          aspectRatio: '16/9',
        }}
      />
    </>
  );
}

export default App;
