import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

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
    if (!canvasRef.current) return;

    const stream = canvasRef.current.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopClick = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    setIsRecording(false);
  };

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        {!isRecording ? (
          <button onClick={handleRecordClick}>録画開始</button>
        ) : (
          <button onClick={handleStopClick}>録画停止</button>
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
