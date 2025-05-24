import { useEffect, useRef, useState } from 'react';

export interface AudioWaveformData {
  waveformData: number[];
  peaks: number[];
  duration: number;
}

export interface UseAudioWaveformReturn {
  waveformData: AudioWaveformData | null;
  isLoading: boolean;
  error: string | null;
  analyzeAudio: (audioFile: File) => Promise<void>;
}

export const useAudioWaveform = (): UseAudioWaveformReturn => {
  const [waveformData, setWaveformData] = useState<AudioWaveformData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const analyzeAudio = async (audioFile: File): Promise<void> => {
    if (!audioFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // AudioContextを作成
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      // ファイルをArrayBufferに変換
      const arrayBuffer = await audioFile.arrayBuffer();

      // オーディオデータをデコード
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // チャンネルデータを取得（モノラルにミックス）
      const channelData = audioBuffer.getChannelData(0);
      const duration = audioBuffer.duration;

      // 波形データを作成（サンプリング）
      const samples = Math.min(1000, channelData.length); // 最大1000ポイント
      const blockSize = Math.floor(channelData.length / samples);
      const waveformPoints: number[] = [];
      const peaks: number[] = [];

      for (let i = 0; i < samples; i++) {
        const start = i * blockSize;
        const end = Math.min(start + blockSize, channelData.length);

        let sum = 0;
        let max = 0;
        let min = 0;

        for (let j = start; j < end; j++) {
          const value = channelData[j];
          sum += Math.abs(value);
          max = Math.max(max, value);
          min = Math.min(min, value);
        }

        // RMS値を計算
        const rms = Math.sqrt(sum / (end - start));
        waveformPoints.push(rms);

        // ピーク値を保存
        peaks.push(Math.max(Math.abs(max), Math.abs(min)));
      }

      setWaveformData({
        waveformData: waveformPoints,
        peaks,
        duration,
      });
    } catch (err) {
      console.error('オーディオ解析エラー:', err);
      setError('オーディオファイルの解析に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    waveformData,
    isLoading,
    error,
    analyzeAudio,
  };
};
