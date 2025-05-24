import type { RefObject } from 'react';
import { useRef, useState } from 'react';

export interface UseCanvasRecordingOptions {
  frameRate?: number;
  mimeType?: string;
  fileName?: string;
}

export interface UseCanvasRecordingReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export const useCanvasRecording = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseCanvasRecordingOptions = {}
): UseCanvasRecordingReturn => {
  const { frameRate = 30, mimeType = 'video/webm', fileName = 'recording' } = options;

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async (): Promise<void> => {
    if (!canvasRef.current || isRecording) return;

    try {
      const stream = canvasRef.current.captureStream(frameRate);
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('録画の開始に失敗しました:', error);
      throw error;
    }
  };

  const stopRecording = (): void => {
    if (!mediaRecorderRef.current || !isRecording) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}-${new Date().toISOString()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
};
