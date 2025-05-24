import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ConversionProgressProps {
  isConverting: boolean;
  conversionProgress: number;
  conversionStatus: string;
}

export const ConversionProgress = ({ isConverting, conversionProgress, conversionStatus }: ConversionProgressProps) => {
  if (!isConverting) return null;

  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
            <div className="text-lg font-semibold text-blue-700">
              🔄 {conversionStatus || 'MP4変換中...'}
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={conversionProgress} 
              className="w-full h-3"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">
                進行度: <span className="text-blue-600 font-bold">{conversionProgress}%</span>
              </span>
              <span className="text-gray-500">
                {conversionProgress < 15 ? '🚀 準備中...' : 
                 conversionProgress < 90 ? '⚡ エンコード中...' : 
                 '✨ 仕上げ中...'}
              </span>
            </div>
          </div>
          
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              💡 初回変換時はFFmpeg.wasmのダウンロードで時間がかかる場合があります
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
