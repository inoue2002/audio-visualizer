import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

export interface UseCanvasRecordingOptions {
  frameRate?: number;
  mimeType?: string;
  fileName?: string;
  forceMP4?: boolean;
}

export interface UseCanvasRecordingReturn {
  isRecording: boolean;
  isConverting: boolean;
  conversionProgress: number;
  conversionStatus: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  supportedFormat: string;
}

export const useCanvasRecording = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseCanvasRecordingOptions = {}
): UseCanvasRecordingReturn => {
  const { frameRate = 30, fileName = 'recording', forceMP4 = true } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStatus, setConversionStatus] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  // コンポーネントのマウント状態を追跡
  const isMountedRef = useRef(true);

  // クリーンアップ
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      // 録画中の場合は停止
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // 安全な状態更新関数（簡略化）
  const safeSetState = <T>(setter: (value: T | ((prev: T) => T)) => void, value: T | ((prev: T) => T)) => {
    // デバッグ用：状態更新をログに出力
    if (setter === setConversionProgress) {
      const progressValue = typeof value === 'function' ? 'function' : value;
      console.log(`🔧 状態更新: ConversionProgress = ${progressValue}`);
    } else if (setter === setConversionStatus) {
      console.log(`🔧 状態更新: ConversionStatus = ${value}`);
    }

    setter(value);
  };

  // FFmpegインスタンスを初期化
  const initFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpegRef.current) {
      return ffmpegRef.current;
    }

    console.log('🚀 FFmpeg.wasm初期化中...');
    safeSetState(setConversionStatus, 'FFmpeg.wasm初期化中...');

    const ffmpeg = new FFmpeg();

    // シンプルなログ監視（デバッグ用）
    ffmpeg.on('log', ({ message }) => {
      if (message.includes('time=')) {
        console.log(`🎬 FFmpeg: ${message.substring(0, 100)}...`);
      }
    });

    try {
      await ffmpeg.load();
      console.log('✅ FFmpeg.wasm初期化完了');
      safeSetState(setConversionStatus, 'FFmpeg.wasm初期化完了');

      ffmpegRef.current = ffmpeg;
      return ffmpeg;
    } catch (error) {
      console.error('❌ FFmpeg.wasm初期化失敗:', error);
      safeSetState(setConversionStatus, 'FFmpeg.wasm初期化失敗');
      throw error;
    }
  };

  // WebMをMP4に変換
  const convertToMP4 = async (webmBlob: Blob): Promise<Blob> => {
    safeSetState(setIsConverting, true);
    safeSetState(setConversionProgress, 0);
    safeSetState(setConversionStatus, '変換準備中...');

    // 進行状況の管理用
    let currentProgress = 0;
    let progressInterval: number | null = null;

    const updateProgress = (newProgress: number, status: string) => {
      // 常に増加するように制限
      const roundedProgress = Math.round(Math.max(currentProgress, newProgress));
      if (roundedProgress > currentProgress) {
        currentProgress = roundedProgress;
        safeSetState(setConversionProgress, currentProgress);
        safeSetState(setConversionStatus, status);
        console.log(`🔄 進行状況: ${currentProgress}% - ${status}`);
      }
    };

    try {
      const ffmpeg = await initFFmpeg();

      console.log(`📊 変換開始 - サイズ: ${(webmBlob.size / 1024 / 1024).toFixed(2)}MB`);

      // 5%: ファイル読み込み開始
      updateProgress(5, '入力ファイル読み込み中...');

      await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob));

      // 15%: ファイル読み込み完了、エンコード開始
      updateProgress(15, 'MP4エンコード実行中...');

      // エンコード中の進行状況を緩やかに更新
      progressInterval = setInterval(() => {
        if (currentProgress < 85) {
          const increment = Math.random() * 3 + 1; // 1-4%の増分
          updateProgress(currentProgress + increment, 'MP4エンコード実行中...');
        }
      }, 1500); // 1.5秒間隔で更新

      // MP4に変換（高品質設定）
      await ffmpeg.exec([
        '-i',
        'input.webm',
        '-c:v',
        'libx264',
        '-crf',
        '23',
        '-preset',
        'medium',
        '-movflags',
        '+faststart',
        'output.mp4',
      ]);

      // インターバルを停止
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      // 90%: エンコード完了、ファイル読み取り開始
      updateProgress(90, '出力ファイル読み取り中...');

      const data = await ffmpeg.readFile('output.mp4');
      const outputSize = data.length;

      // 95%: ファイル読み取り完了、クリーンアップ中
      updateProgress(95, 'クリーンアップ中...');

      console.log(`✅ 変換完了 - 出力: ${(outputSize / 1024 / 1024).toFixed(2)}MB`);

      // クリーンアップ
      await ffmpeg.deleteFile('input.webm');
      await ffmpeg.deleteFile('output.mp4');

      // 100%: 完了
      updateProgress(100, '変換完了');

      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('❌ MP4変換エラー:', error);
      safeSetState(setConversionStatus, '変換エラーが発生しました');
      throw error;
    } finally {
      // インターバルのクリーンアップ
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      safeSetState(setIsConverting, false);
      // ステータスリセット
      setTimeout(() => {
        safeSetState(setConversionStatus, '');
        safeSetState(setConversionProgress, 0);
      }, 2000);
    }
  };

  // サポートされているMIMEタイプを検出（WebMを優先、後でMP4に変換）
  const getSupportedMimeType = (): { mimeType: string; extension: string } => {
    const webmTypes = ['video/webm; codecs="vp9"', 'video/webm; codecs="vp8"', 'video/webm'];

    for (const type of webmTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return { mimeType: type, extension: 'webm' };
      }
    }

    // フォールバック
    return { mimeType: 'video/webm', extension: 'webm' };
  };

  const { mimeType } = getSupportedMimeType();

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
      safeSetState(setIsRecording, true);
      console.log('🎬 録画開始');
    } catch (error) {
      console.error('❌ 録画開始失敗:', error);
      throw error;
    }
  };

  const stopRecording = (): void => {
    if (!mediaRecorderRef.current || !isRecording) return;

    console.log('🛑 録画停止');
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const webmBlob = new Blob(chunksRef.current, { type: mimeType });

      try {
        let finalBlob: Blob;
        let extension: string;

        if (forceMP4) {
          console.log('🔄 MP4変換中...');
          finalBlob = await convertToMP4(webmBlob);
          extension = 'mp4';
        } else {
          finalBlob = webmBlob;
          extension = 'webm';
        }

        // ダウンロード
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}-${new Date().toISOString()}.${extension}`;
        a.click();
        URL.revokeObjectURL(url);

        console.log(`💾 ${extension.toUpperCase()}ダウンロード完了`);
      } catch (error) {
        console.error('❌ 変換/ダウンロードエラー:', error);
        // エラー時はWebMでダウンロード
        const url = URL.createObjectURL(webmBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}-${new Date().toISOString()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      }
    };

    safeSetState(setIsRecording, false);
  };

  const outputFormat = forceMP4 ? 'MP4' : 'WebM';

  return {
    isRecording,
    isConverting,
    conversionProgress,
    conversionStatus,
    startRecording,
    stopRecording,
    supportedFormat: `${outputFormat} (via ffmpeg.wasm)`,
  };
};
