import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useEffect, useRef, useState } from 'react';
import { ConversionProgress } from './components/ConversionProgress';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HelpSection } from './components/HelpSection';
import { ParameterPanel } from './components/ParameterPanel';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useCanvasRecording } from './hooks/useCanvasRecording';
import { useRealtimeWaveform } from './hooks/useRealtimeWaveform';
import { useVisualParams } from './hooks/useVisualParams';
import type { ActiveRange } from './types/visualizer';
import { trackPageView } from './utils/analytics';
import { generateMockFrequencyData } from './utils/mockData';
import { drawExpandedWaveform } from './utils/visualizer';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    audioFile,
    isPlaying,
    handleFileChange,
    handlePlayClick,
    getAudioElement,
    resetAudio,
    playAudio,
    setOnEndedCallback,
  } = useAudioPlayer();
  const {
    isRecording,
    startRecording,
    stopRecording,
    supportedFormat,
    isConverting,
    conversionProgress,
    conversionStatus,
  } = useCanvasRecording(canvasRef, {
    frameRate: 30,
    fileName: 'canvas-recording',
    forceMP4: true,
    audioFile: audioFile || undefined,
  });
  const {
    frequencyData,
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
    resetAnalysis,
    error: realtimeError,
  } = useRealtimeWaveform();

  // パラメータ管理
  const { visualParams, setVisualParams, resetToDefault } = useVisualParams();

  // アクティブ範囲の追跡
  const [activeRange, setActiveRange] = useState<ActiveRange>({ start: 0, end: 127 });

  // パラメーター調整画面の展開状態
  const [showParameterPanel, setShowParameterPanel] = useState(false);

  // Google Analytics - ページビュー追跡
  useEffect(() => {
    trackPageView('Audio Visualizer - メインページ');
  }, []);

  // 音楽終了時のコールバック設定
  useEffect(() => {
    setOnEndedCallback(() => {
      if (isRecording) {
        console.log('音楽終了により録画を停止します');
        stopRecording();
      }
    });
  }, [isRecording, stopRecording, setOnEndedCallback]);

  // アクティブな周波数範囲を検出
  useEffect(() => {
    if (frequencyData && isPlaying) {
      const threshold = visualParams.threshold;
      let firstActive = -1;
      let lastActive = -1;

      for (let i = 0; i < frequencyData.length; i++) {
        if (frequencyData[i] > threshold) {
          if (firstActive === -1) firstActive = i;
          lastActive = i;
        }
      }

      if (firstActive !== -1 && lastActive !== -1) {
        const margin = Math.floor((lastActive - firstActive) * 0.1);
        const start = Math.max(0, firstActive - margin);
        const end = Math.min(frequencyData.length - 1, lastActive + margin);

        const minWidth = Math.floor(frequencyData.length * visualParams.minWidthRatio);
        if (end - start < minWidth) {
          const center = Math.floor((start + end) / 2);
          const newStart = Math.max(0, center - Math.floor(minWidth / 2));
          const newEnd = Math.min(frequencyData.length - 1, newStart + minWidth);
          setActiveRange({ start: newStart, end: newEnd });
        } else {
          setActiveRange({ start, end });
        }
      }
    }
  }, [frequencyData, isPlaying, visualParams.threshold, visualParams.minWidthRatio]);

  // 再生開始時にアクティブ範囲をリセット
  useEffect(() => {
    if (isPlaying) {
      setActiveRange({ start: 0, end: 127 });
    }
  }, [isPlaying]);

  // 再生状態が変化したときにリアルタイム解析を開始/停止
  useEffect(() => {
    const audioElement = getAudioElement();

    if (isPlaying && audioElement && !isAnalyzing) {
      startAnalysis(audioElement).catch(console.error);
    } else if (!isPlaying && isAnalyzing) {
      stopAnalysis();
    }
  }, [isPlaying, isAnalyzing, startAnalysis, stopAnalysis, getAudioElement]);

  // メインCanvasでのアニメーションループ
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (frequencyData && isPlaying) {
        drawExpandedWaveform(ctx, frequencyData, canvas.width, canvas.height, activeRange, visualParams);
      } else {
        const mockData = generateMockFrequencyData(startTime);
        const mockRange = { start: 0, end: mockData.length - 1 };
        drawExpandedWaveform(ctx, mockData, canvas.width, canvas.height, mockRange, visualParams);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [frequencyData, isPlaying, activeRange, visualParams]);

  const handlePlayAndRecordClick = async () => {
    if (!audioFile) {
      alert('音楽ファイルを選択してください');
      return;
    }

    try {
      await startRecording();
      await playAudio();
      console.log('🎵 再生&録画開始完了');
    } catch (error) {
      console.error('❌ 再生&録画開始エラー:', error);
      if (isRecording) {
        stopRecording();
      }
    }
  };

  const handleResetClick = () => {
    resetAnalysis();
    resetAudio();
    setActiveRange({ start: 0, end: 127 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-6 space-y-6">
        {/* コントロールパネル */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* ファイル選択セクション */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <Label htmlFor="audio-file" className="text-sm font-medium mb-2 block">
                    🎵 音楽ファイルを選択
                  </Label>
                  <Input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                </div>

                {audioFile && (
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">📁 {audioFile.name}</span>
                      <br />
                      <span className="text-xs">({(audioFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button onClick={handlePlayClick} variant={isPlaying ? 'destructive' : 'default'} size="sm">
                      {isPlaying ? '⏸️ 一時停止' : '▶️ 再生'}
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* ステータス表示 */}
              <div className="space-y-3">
                {realtimeError && (
                  <Alert variant="destructive">
                    <AlertDescription>❌ エラー: {realtimeError}</AlertDescription>
                  </Alert>
                )}

                {isAnalyzing && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      🟢 リアルタイム解析中... (範囲: {activeRange.start}-{activeRange.end})
                    </AlertDescription>
                  </Alert>
                )}

                {!isPlaying && !isAnalyzing && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertDescription className="text-blue-800">
                      🔵 モックモード - パラメータ調整の効果をプレビュー中
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* 録画コントロール */}
              <div className="flex flex-wrap gap-3 items-center">
                {!isRecording ? (
                  <Button onClick={handlePlayAndRecordClick} size="lg" className="bg-red-600 hover:bg-red-700">
                    🔴 再生&録画開始
                  </Button>
                ) : (
                  <Button onClick={stopRecording} size="lg" variant="destructive">
                    ⏹️ 録画停止
                  </Button>
                )}

                {audioFile && (
                  <Button onClick={handleResetClick} variant="outline">
                    🔄 オーディオリセット
                  </Button>
                )}

                <Button
                  onClick={() => setShowParameterPanel(!showParameterPanel)}
                  variant="outline"
                  size="sm"
                  className={showParameterPanel ? 'bg-blue-100' : ''}
                >
                  ⚙️ パラメーター設定
                </Button>
              </div>

              {/* 録画情報 */}
              <div className="text-sm text-slate-600 bg-slate-100 p-3 rounded-lg">
                <span className="font-medium">📹 録画形式:</span> {supportedFormat}
                {audioFile ? ' (音声付き)' : ' (映像のみ)'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 変換進行状況 */}
        <ConversionProgress
          isConverting={isConverting}
          conversionProgress={conversionProgress}
          conversionStatus={conversionStatus}
        />

        {/* 使い方 */}
        <HelpSection />

        {/* パラメーター調整パネル */}
        {showParameterPanel && (
          <ParameterPanel
            visualParams={visualParams}
            setVisualParams={setVisualParams}
            resetToDefault={resetToDefault}
          />
        )}

        {/* ビジュアライザーキャンバス */}
        <Card>
          <CardContent className="p-4">
            <canvas ref={canvasRef} className="w-full aspect-video rounded-lg border-2 border-slate-200 shadow-lg" />
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

export default App;
