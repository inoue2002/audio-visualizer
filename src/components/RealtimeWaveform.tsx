import { useEffect, useRef } from 'react';

interface RealtimeWaveformProps {
  frequencyData: Uint8Array | null;
  width: number;
  height: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
  backgroundColor?: string;
  style?: 'bars' | 'smooth';
}

export const RealtimeWaveform: React.FC<RealtimeWaveformProps> = ({
  frequencyData,
  width,
  height,
  barWidth = 4,
  gap = 1,
  barColor = '#00ff88',
  backgroundColor = 'transparent',
  style = 'bars',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズを設定
    canvas.width = width;
    canvas.height = height;

    // 背景をクリア
    ctx.clearRect(0, 0, width, height);

    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    if (!frequencyData) return;

    const dataLength = frequencyData.length;

    if (style === 'bars') {
      // バースタイルの描画
      const totalBarWidth = barWidth + gap;
      const availableWidth = width - gap;
      const barsToShow = Math.min(dataLength, Math.floor(availableWidth / totalBarWidth));
      const startX = (width - (barsToShow * totalBarWidth - gap)) / 2;

      for (let i = 0; i < barsToShow; i++) {
        const value = frequencyData[i];
        const normalizedValue = value / 255;
        const barHeight = normalizedValue * height * 0.9;

        const x = startX + i * totalBarWidth;
        const y = height - barHeight;

        // 周波数に応じて色を変化させる
        const hue = (i / barsToShow) * 240; // 青から赤へ
        const saturation = 80 + normalizedValue * 20; // 音量に応じて彩度を変化
        const lightness = 40 + normalizedValue * 40; // 音量に応じて明度を変化

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    } else {
      // スムーズな波形スタイルの描画
      ctx.strokeStyle = barColor;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = width / dataLength;
      let x = 0;

      for (let i = 0; i < dataLength; i++) {
        const value = frequencyData[i];
        const normalizedValue = value / 255;
        const y = height - normalizedValue * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
    }
  }, [frequencyData, width, height, barWidth, gap, barColor, backgroundColor, style]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};
