import { useEffect, useRef, useState } from 'react';

export interface UseAudioPlayerReturn {
  audioFile: File | null;
  isPlaying: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlayClick: () => void;
  resetAudio: () => void;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
      setIsPlaying(false);

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

      // 音声が終了した時の処理
      audioRef.current.onended = () => {
        setIsPlaying(false);
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
    setIsPlaying(false);
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
    isPlaying,
    handleFileChange,
    handlePlayClick,
    resetAudio,
  };
};
