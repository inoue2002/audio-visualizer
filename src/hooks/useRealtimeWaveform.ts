import { useCallback, useEffect, useRef, useState } from 'react';

export interface RealtimeWaveformReturn {
  frequencyData: Uint8Array | null;
  isAnalyzing: boolean;
  startAnalysis: (audioElement: HTMLAudioElement) => Promise<void>;
  stopAnalysis: () => void;
  error: string | null;
}

export const useRealtimeWaveform = (): RealtimeWaveformReturn => {
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startAnalysis = useCallback(async (audioElement: HTMLAudioElement): Promise<void> => {
    try {
      setError(null);

      // AudioContextを作成
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      // 既存のソースがあればクリーンアップ
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      // AudioContextが停止している場合は再開
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // オーディオソースを作成
      sourceRef.current = audioContext.createMediaElementSource(audioElement);

      // Analyserノードを作成
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256; // 128個の周波数ビンを作成
      analyserRef.current.smoothingTimeConstant = 0.8;

      // オーディオルーティング: source -> analyser -> destination
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);

      // 周波数データ配列を初期化
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsAnalyzing(true);

      // リアルタイム解析ループ
      const analyze = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        setFrequencyData(new Uint8Array(dataArray));

        animationFrameRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (err) {
      console.error('リアルタイム解析エラー:', err);
      setError('リアルタイム解析の開始に失敗しました');
    }
  }, []);

  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    setIsAnalyzing(false);
    setFrequencyData(null);
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      stopAnalysis();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stopAnalysis]);

  return {
    frequencyData,
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    error,
  };
};
