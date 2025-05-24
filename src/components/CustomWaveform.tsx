import { useEffect, useRef } from 'react';
import type { AudioWaveformData } from '../hooks/useAudioWaveform';

interface CustomWaveformProps {
  waveformData: AudioWaveformData;
  currentTime: number;
  width: number;
  height: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
  barPlayedColor?: string;
  backgroundColor?: string;
}

export const CustomWaveform: React.FC<CustomWaveformProps> = ({
  waveformData,
  currentTime,
  width,
  height,
  barWidth = 3,
  gap = 1,
  barColor = 'rgba(255, 255, 255, 0.5)',
  barPlayedColor = '#00ff88',
  backgroundColor = 'transparent',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !waveformData) return;

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

    const { waveformData: data, duration } = waveformData;
    const dataLength = data.length;

    if (dataLength === 0) return;

    // 現在の再生位置の割合を計算
    const progressRatio = duration > 0 ? currentTime / duration : 0;
    const playedBars = Math.floor(dataLength * progressRatio);

    // バーの総幅を計算
    const totalBarWidth = barWidth + gap;
    const totalWidth = dataLength * totalBarWidth - gap;
    const startX = (width - totalWidth) / 2;

    // 波形データの最大値を取得（正規化用）
    const maxValue = Math.max(...data);

    if (maxValue === 0) return;

    // 各バーを描画
    for (let i = 0; i < dataLength; i++) {
      const value = data[i];
      const normalizedValue = value / maxValue;
      const barHeight = normalizedValue * (height * 0.8); // 高さの80%を使用

      const x = startX + i * totalBarWidth;
      const y = (height - barHeight) / 2;

      // 再生済みかどうかで色を分ける
      ctx.fillStyle = i < playedBars ? barPlayedColor : barColor;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }, [waveformData, currentTime, width, height, barWidth, gap, barColor, barPlayedColor, backgroundColor]);

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
