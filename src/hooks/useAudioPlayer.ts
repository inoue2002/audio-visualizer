import { useEffect, useRef, useState } from 'react';

export interface UseAudioPlayerReturn {
  audioFile: File | null;
  audioBlob: Blob | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlayClick: () => void;
  resetAudio: () => void;
  getAudioElement: () => HTMLAudioElement | null;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 前のURLがあればクリーンアップ
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      setAudioFile(file);
      setAudioBlob(file); // FileはBlobを継承しているので直接設定可能
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }
  };

  const handlePlayClick = () => {
    if (!audioFile) return;

    if (!audioRef.current) {
      const audioUrl = URL.createObjectURL(audioFile);
      audioUrlRef.current = audioUrl;
      audioRef.current = new Audio(audioUrl);

      // 音声のメタデータが読み込まれた時の処理
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };

      // 再生時間の更新
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      // 音声が終了した時の処理
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      // エラーハンドリング
      audioRef.current.onerror = (error) => {
        console.error('音声再生エラー:', error);
        setIsPlaying(false);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error('音声再生に失敗しました:', error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    setAudioFile(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const getAudioElement = () => {
    return audioRef.current;
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  return {
    audioFile,
    audioBlob,
    isPlaying,
    currentTime,
    duration,
    handleFileChange,
    handlePlayClick,
    resetAudio,
    getAudioElement,
  };
};
